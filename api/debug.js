// 环境变量诊断端点
export default async function handler(req, res) {
  // CORS设置
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 检查所有环境变量
    const envCheck = {
      // Supabase相关
      SUPABASE_URL: {
        exists: !!process.env.SUPABASE_URL,
        length: process.env.SUPABASE_URL?.length || 0,
        preview: process.env.SUPABASE_URL?.substring(0, 20) + '...' || 'NOT_SET'
      },
      SUPABASE_SERVICE_KEY: {
        exists: !!process.env.SUPABASE_SERVICE_KEY,
        length: process.env.SUPABASE_SERVICE_KEY?.length || 0,
        preview: process.env.SUPABASE_SERVICE_KEY ? 'sk_***' : 'NOT_SET'
      },
      SUPABASE_ANON_KEY: {
        exists: !!process.env.SUPABASE_ANON_KEY,
        length: process.env.SUPABASE_ANON_KEY?.length || 0,
        preview: process.env.SUPABASE_ANON_KEY ? 'eyJ***' : 'NOT_SET'
      },
      
      // Resend相关
      RESEND_API_KEY: {
        exists: !!process.env.RESEND_API_KEY,
        length: process.env.RESEND_API_KEY?.length || 0,
        preview: process.env.RESEND_API_KEY ? 're_***' : 'NOT_SET'
      },
      RESEND_FROM_EMAIL: {
        exists: !!process.env.RESEND_FROM_EMAIL,
        value: process.env.RESEND_FROM_EMAIL || 'NOT_SET'
      },
      RESEND_FROM_NAME: {
        exists: !!process.env.RESEND_FROM_NAME,
        value: process.env.RESEND_FROM_NAME || 'NOT_SET'
      },
      
      // JWT相关
      JWT_SECRET: {
        exists: !!process.env.JWT_SECRET,
        length: process.env.JWT_SECRET?.length || 0,
        preview: process.env.JWT_SECRET ? '***' : 'NOT_SET'
      },
      JWT_EXPIRE: {
        exists: !!process.env.JWT_EXPIRE,
        value: process.env.JWT_EXPIRE || 'NOT_SET'
      },
      
      // 其他
      FRONTEND_URL: {
        exists: !!process.env.FRONTEND_URL,
        value: process.env.FRONTEND_URL || 'NOT_SET'
      },
      NODE_ENV: {
        exists: !!process.env.NODE_ENV,
        value: process.env.NODE_ENV || 'NOT_SET'
      }
    }

    // 测试Supabase连接
    let supabaseTest = { status: 'not_tested', error: null }
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        // 尝试创建Supabase客户端
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_KEY,
          { auth: { autoRefreshToken: false, persistSession: false } }
        )
        
        // 测试连接 - 简单查询
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)
        
        if (error) {
          supabaseTest = {
            status: 'error',
            error: error.message,
            code: error.code
          }
        } else {
          supabaseTest = { status: 'success' }
        }
      } catch (err) {
        supabaseTest = {
          status: 'connection_failed',
          error: err.message
        }
      }
    }

    // 测试Resend API
    let resendTest = { status: 'not_tested', error: null }
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/domains', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          resendTest = {
            status: 'success',
            domains_count: data.data?.length || 0
          }
        } else {
          resendTest = {
            status: 'api_error',
            http_status: response.status,
            error: response.statusText
          }
        }
      } catch (err) {
        resendTest = {
          status: 'network_error',
          error: err.message
        }
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      platform: 'vercel',
      node_version: process.version,
      environment_variables: envCheck,
      service_tests: {
        supabase: supabaseTest,
        resend: resendTest
      },
      recommendations: {
        critical_missing: Object.entries(envCheck)
          .filter(([key, value]) => !value.exists)
          .map(([key]) => key),
        service_issues: [
          ...(supabaseTest.status !== 'success' ? ['Supabase连接失败'] : []),
          ...(resendTest.status !== 'success' ? ['Resend API连接失败'] : [])
        ]
      }
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    })
  }
}