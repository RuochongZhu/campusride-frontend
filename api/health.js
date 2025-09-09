// 简单的测试API端点
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'CampusRide API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    })
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Method not allowed'
      }
    })
  }
}