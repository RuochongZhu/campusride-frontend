import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 初始化Supabase客户端
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// CORS处理函数
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// 主处理函数
export default async function handler(req, res) {
  setCorsHeaders(res)
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { method, url, query } = req
  
  // 从Vercel的query中获取路由路径，或者从URL中解析
  let routePath = ''
  if (query.route && Array.isArray(query.route)) {
    routePath = `/${query.route.join('/')}`
  } else if (url) {
    // 备用方案：从URL中提取路径
    const urlPath = url.split('/api/v1')[1] || ''
    routePath = urlPath.split('?')[0] // 移除查询参数
  }
  
  console.log('API Debug:', { method, url, routePath, query })

  try {
    // 健康检查
    if (method === 'GET' && (routePath === '/health' || routePath === '')) {
      return res.status(200).json({
        success: true,
        message: 'CampusRide API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        debug: { method, url, routePath, query }
      })
    }

    // 登录端点
    if (method === 'POST' && routePath === '/auth/login') {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: '请输入邮箱和密码'
          }
        })
      }

      // 检查数据库连接
      try {
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // 表不存在，返回数据库错误
            return res.status(500).json({
              success: false,
              error: {
                code: 'DATABASE_ERROR',
                message: '数据库连接失败，请稍后重试'
              }
            })
          }
          throw error
        }

        if (!users) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: '邮箱或密码错误'
            }
          })
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, users.password_hash)
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: '邮箱或密码错误'
            }
          })
        }

        // 检查邮箱验证状态
        if (!users.is_verified) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'EMAIL_NOT_VERIFIED',
              message: '请先验证您的邮箱'
            }
          })
        }

        // 生成JWT token
        const token = jwt.sign(
          { 
            userId: users.id, 
            email: users.email 
          }, 
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: process.env.JWT_EXPIRE || '24h' }
        )

        // 返回成功响应
        return res.status(200).json({
          success: true,
          data: {
            token,
            user: {
              id: users.id,
              email: users.email,
              firstName: users.first_name,
              lastName: users.last_name,
              role: users.role || 'user'
            }
          }
        })

      } catch (dbError) {
        console.error('Database error:', dbError)
        return res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: '数据库连接失败，请稍后重试'
          }
        })
      }
    }

    // 注册端点
    if (method === 'POST' && routePath === '/auth/register') {
      const { email, password } = req.body
      
      console.log('Register attempt:', { email: email?.substring(0, 5) + '***', hasPassword: !!password })
      
      // 检查环境变量
      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({
          success: false,
          error: {
            code: 'CONFIG_ERROR',
            message: '服务器配置错误，请联系管理员'
          }
        })
      }

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: '请输入邮箱和密码'
          }
        })
      }

      try {
        // 检查用户是否已存在
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('email')
          .eq('email', email)
          .single()

        console.log('User check result:', { existingUser: !!existingUser, error: checkError?.code })

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Database check error:', checkError)
          return res.status(500).json({
            success: false,
            error: {
              code: 'DATABASE_ERROR',
              message: '数据库连接失败，请稍后重试'
            }
          })
        }

        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'EMAIL_EXISTS',
              message: '该邮箱已被注册'
            }
          })
        }

        // 创建新用户
        const hashedPassword = await bcrypt.hash(password, 12)
        
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
            email,
            password_hash: hashedPassword,
            is_verified: false,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        console.log('User creation result:', { success: !!newUser, error: error?.code })

        if (error) {
          console.error('User creation error:', error)
          throw error
        }

        return res.status(201).json({
          success: true,
          message: '注册成功，请查收验证邮件'
        })

      } catch (dbError) {
        console.error('Database error:', dbError)
        return res.status(500).json({
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: '数据库连接失败，请稍后重试'
          }
        })
      }
    }

    // 如果没有匹配的路由
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'API endpoint not found'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误'
      }
    })
  }
}