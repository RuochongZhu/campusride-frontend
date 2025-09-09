// 简单的健康检查API端点
export default function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: '🎉 CampusRide API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      debug: {
        method: req.method,
        url: req.url,
        query: req.query,
        // 环境变量检查
        env_check: {
          SUPABASE_URL: !!process.env.SUPABASE_URL ? '✅ SET' : '❌ MISSING',
          SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY ? '✅ SET' : '❌ MISSING',
          SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY ? '✅ SET' : '❌ MISSING',
          RESEND_API_KEY: !!process.env.RESEND_API_KEY ? '✅ SET' : '❌ MISSING',
          RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || '❌ MISSING',
          RESEND_FROM_NAME: process.env.RESEND_FROM_NAME || '❌ MISSING',
          JWT_SECRET: !!process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING',
          FRONTEND_URL: process.env.FRONTEND_URL || '❌ MISSING'
        }
      }
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}