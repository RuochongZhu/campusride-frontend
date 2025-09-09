import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

    // 演示账号登录
    if (email === 'demo@cornell.edu' && password === 'demo1234') {
      const token = jwt.sign(
        { userId: 'demo-user-001', email: 'demo@cornell.edu' },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      )

      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: 'demo-user-001',
            email: 'demo@cornell.edu',
            firstName: 'Demo',
            lastName: 'User',
            role: 'user'
          }
        },
        message: '演示登录成功'
      })
    }

    // 检查环境变量
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(500).json({
        success: false,
        error: { 
          code: 'CONFIG_ERROR', 
          message: '数据库配置错误，请使用演示账号: demo@cornell.edu / demo1234' 
        }
      })
    }

    // 数据库登录
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' }
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash || '')
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: '邮箱或密码错误' }
      })
    }

    // 检查邮箱验证
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        error: { code: 'EMAIL_NOT_VERIFIED', message: '请先验证您的邮箱' }
      })
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // 返回用户信息
    const { password_hash, email_verification_token, ...userWithoutSensitive } = user

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: userWithoutSensitive
      },
      message: '登录成功'
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      error: { 
        code: 'INTERNAL_ERROR', 
        message: '服务器错误，请使用演示账号: demo@cornell.edu / demo1234' 
      }
    })
  }
}