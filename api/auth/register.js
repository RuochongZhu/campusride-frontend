import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail, generateEmailVerificationToken, generateTokenExpiry } from '../../campusride-backend/src/services/email.service.js'

// 初始化Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default async function handler(req, res) {
  // CORS设置
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: '只支持POST请求' }
    })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: '请输入邮箱和密码' }
      })
    }

    // Cornell邮箱验证
    if (!email.endsWith('@cornell.edu')) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FORMAT', message: '邮箱必须以@cornell.edu结尾' }
      })
    }

    // 密码验证
    if (password.length !== 8 || !/^[a-zA-Z0-9]{8}$/.test(password)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: '密码必须是8位字母和数字组合' }
      })
    }

    // 检查环境变量
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({
        success: false,
        error: { code: 'CONFIG_ERROR', message: '服务器配置错误' }
      })
    }

    // 检查用户是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: '该邮箱已被注册' }
      })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)
    const netid = email.split('@')[0]

    // 生成验证token
    const emailVerificationToken = generateEmailVerificationToken()
    const emailVerificationExpires = generateTokenExpiry()

    // 创建用户
    const { data: newUser, error } = await supabase
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
      .select('id, email, first_name, last_name')
      .single()

    if (error) {
      console.error('User creation error:', error)
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: '创建用户失败' }
      })
    }

    // 发送验证邮件
    try {
      await sendVerificationEmail(email, emailVerificationToken)
      console.log(`✅ Verification email sent to ${email}`)
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError)
      // 不阻止注册
    }

    return res.status(201).json({
      success: true,
      data: { user: newUser },
      message: '注册成功！请检查您的邮箱进行验证。'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' }
    })
  }
}