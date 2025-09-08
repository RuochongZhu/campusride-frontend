import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { supabaseAdmin } from '../config/database.js';
import { AppError, ERROR_CODES } from '../middleware/error.middleware.js';
import { 
  sendVerificationEmail, 
  generateEmailVerificationToken, 
  generateTokenExpiry,
  isTokenExpired,
  resendVerificationEmail
} from '../services/email.service.js';

// 生成JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// 用户注册
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 基础验证
    if (!email || !password) {
      throw new AppError('Email and password are required', 400, ERROR_CODES.REQUIRED_FIELD_MISSING);
    }

    // Cornell邮箱验证
    if (!email.endsWith('@cornell.edu')) {
      throw new AppError('Email must end with @cornell.edu', 400, ERROR_CODES.INVALID_FORMAT);
    }

    // 密码验证: 必须是8位字母和数字的组合
    if (password.length !== 8) {
      throw new AppError('Password must be exactly 8 characters', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    const passwordRegex = /^[a-zA-Z0-9]{8}$/;
    if (!passwordRegex.test(password)) {
      throw new AppError('Password must contain only letters and numbers', 400, ERROR_CODES.VALIDATION_ERROR);
    }

    // 检查用户是否已存在
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new AppError('User already exists', 400, ERROR_CODES.RESOURCE_ALREADY_EXISTS);
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 从邮箱提取netid作为student_id
    const netid = email.split('@')[0];

    // 生成邮箱验证token和过期时间
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationExpires = generateTokenExpiry();

    // 创建用户 - 未验证状态
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert({
        student_id: netid,
        email,
        password_hash: hashedPassword,
        first_name: 'User',
        last_name: netid,
        university: 'Cornell University',
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires.toISOString(),
        is_verified: false
      })
      .select('id, email, first_name, last_name, university, student_id, created_at')
      .single();

    if (error) {
      throw new AppError('Failed to create user', 500, ERROR_CODES.DATABASE_ERROR, error);
    }

    // 发送验证邮件
    try {
      await sendVerificationEmail(email, emailVerificationToken);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // 不阻止注册，但记录错误
    }

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        message: 'Registration successful! Please check your email to verify your account.'
      },
      message: 'User registered successfully. Please verify your email address.'
    });
  } catch (error) {
    next(error);
  }
};

// 用户登录
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, ERROR_CODES.REQUIRED_FIELD_MISSING);
    }

    // 演示模式账号
    if (email === 'demo@cornell.edu' && password === 'demo1234') {
      const demoUser = {
        id: 'demo-user-001',
        email: 'demo@cornell.edu',
        first_name: 'Demo',
        last_name: 'User',
        university: 'Cornell University',
        role: 'user',
        is_active: true,
        is_verified: true,
        points: 100
      };
      
      const token = generateToken(demoUser.id);
      
      return res.json({
        success: true,
        data: {
          user: demoUser,
          token,
          tokenType: 'Bearer'
        },
        message: 'Demo login successful'
      });
    }

    try {
      // 查找用户
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        // 如果是数据库连接错误
        if (error.code === 'PGRST116' || error.message?.includes('schema')) {
          throw new AppError('Database connection error. Please use demo account.', 500, 'DATABASE_ERROR');
        }
        if (error.code === 'PGRST301') {
          // 没有找到用户
          throw new AppError('Invalid credentials', 401, ERROR_CODES.INVALID_CREDENTIALS);
        }
        throw error;
      }

      if (!user) {
        throw new AppError('Invalid credentials', 401, ERROR_CODES.INVALID_CREDENTIALS);
      }

      // 检查账户是否激活
      const isActive = user.is_active !== undefined ? user.is_active : true;
      if (!isActive) {
        throw new AppError('Account is disabled', 401, ERROR_CODES.ACCESS_DENIED);
      }

      // 检查邮箱是否已验证
      if (!user.is_verified) {
        throw new AppError(
          'Please verify your email address before logging in. Check your inbox for the verification link.',
          401,
          'EMAIL_NOT_VERIFIED'
        );
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password_hash || '');
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401, ERROR_CODES.INVALID_CREDENTIALS);
      }

      // 生成token
      const token = generateToken(user.id);

      // 尝试更新最后登录时间（如果失败也不影响登录）
      try {
        await supabaseAdmin
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', user.id);
      } catch (updateError) {
        console.error('Failed to update last login time:', updateError);
      }

      // 移除密码hash
      const { password_hash, email_verification_token, ...userWithoutSensitiveData } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutSensitiveData,
          token,
          tokenType: 'Bearer'
        },
        message: 'Login successful'
      });
    } catch (dbError) {
      // 如果是已知的AppError，直接抛出
      if (dbError.isOperational) {
        throw dbError;
      }
      // 其他数据库错误时提供友好的错误消息
      console.error('Database error during login:', dbError);
      throw new AppError(
        'Database connection failed. Please try demo account: demo@cornell.edu / demo1234',
        500,
        'DATABASE_ERROR'
      );
    }
  } catch (error) {
    next(error);
  }
};

// 用户登出
export const logout = async (_req, res, next) => {
  try {
    // 在实际应用中，这里可以将token加入黑名单
    // 目前只是返回成功响应
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// 邮箱验证
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new AppError('Verification token is required', 400, ERROR_CODES.REQUIRED_FIELD_MISSING);
    }

    // 查找用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, email_verification_token, email_verification_expires, is_verified')
      .eq('email_verification_token', token)
      .single();

    if (error || !user) {
      throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN');
    }

    // 检查用户是否已经验证过
    if (user.is_verified) {
      return res.json({
        success: true,
        message: 'Email address is already verified'
      });
    }

    // 检查token是否过期
    if (isTokenExpired(user.email_verification_expires)) {
      throw new AppError(
        'Verification token has expired. Please request a new verification email.',
        400,
        'TOKEN_EXPIRED'
      );
    }

    // 更新用户验证状态
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        is_verified: true,
        email_verification_token: null,
        email_verification_expires: null
      })
      .eq('id', user.id);

    if (updateError) {
      throw new AppError('Failed to verify email', 500, ERROR_CODES.DATABASE_ERROR);
    }

    res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to your account.'
    });
  } catch (error) {
    next(error);
  }
};

// 重新发送验证邮件
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400, ERROR_CODES.REQUIRED_FIELD_MISSING);
    }

    // 查找用户
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, is_verified')
      .eq('email', email)
      .single();

    if (error || !user) {
      // 安全考虑：不透露用户是否存在
      return res.json({
        success: true,
        message: 'If the email address is registered, a verification email will be sent.'
      });
    }

    // 检查用户是否已经验证过
    if (user.is_verified) {
      return res.json({
        success: true,
        message: 'Email address is already verified'
      });
    }

    // 生成新的验证token
    const newToken = generateEmailVerificationToken();
    const newExpiry = generateTokenExpiry();

    // 更新用户的验证token
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        email_verification_token: newToken,
        email_verification_expires: newExpiry.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw new AppError('Failed to update verification token', 500, ERROR_CODES.DATABASE_ERROR);
    }

    // 发送新的验证邮件
    try {
      await resendVerificationEmail(email, newToken);
      console.log(`✅ New verification email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      throw new AppError('Failed to send verification email', 500, 'EMAIL_SEND_FAILED');
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    next(error);
  }
};

// 刷新token
export const refreshToken = async (req, res, next) => {
  try {
    const { token: currentToken } = req.body;

    if (!currentToken) {
      throw new AppError('Token is required', 400, ERROR_CODES.REQUIRED_FIELD_MISSING);
    }

    const decoded = jwt.verify(currentToken, process.env.JWT_SECRET);
    
    // 验证用户仍然存在且激活
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user || !user.is_active) {
      throw new AppError('Invalid token', 401, ERROR_CODES.TOKEN_INVALID);
    }

    // 生成新token
    const newToken = generateToken(user.id);

    res.json({
      success: true,
      data: {
        token: newToken,
        tokenType: 'Bearer'
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    next(error);
  }
}; 