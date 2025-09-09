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
      debug: {
        method: req.method,
        url: req.url,
        query: req.query,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasResendKey: !!process.env.RESEND_API_KEY
      }
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}