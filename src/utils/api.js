import axios from 'axios'
import { getAuthToken } from './auth.js'

// 获取API基础URL
const getBaseURL = () => {
  // 生产环境（Vercel部署）
  if (import.meta.env.PROD) {
    return '/api/v1'
  }
  // 开发环境
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
}

// 创建axios实例
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    
    // 认证错误
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      return Promise.reject(new Error('认证已过期'))
    }
    
    // 处理HTTP错误
    const message = error.response?.data?.error?.message || 
                   error.response?.data?.message || 
                   error.message || 
                   '网络请求失败'
    
    return Promise.reject(new Error(message))
  }
)

// API方法
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data)
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserStats: () => api.get('/users/stats'),
  getLeaderboard: () => api.get('/users/leaderboard')
}

export const pointsAPI = {
  getPoints: () => api.get('/points'),
  claimDailyReward: () => api.post('/points/daily-reward'),
  getPointsHistory: () => api.get('/points/history')
}

export const activityAPI = {
  getActivities: (params = {}) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  joinActivity: (id) => api.post(`/activities/${id}/join`),
  leaveActivity: (id) => api.post(`/activities/${id}/leave`)
}

export const rideshareAPI = {
  getRides: (params = {}) => api.get('/rideshare', { params }),
  getRide: (id) => api.get(`/rideshare/${id}`),
  createRide: (data) => api.post('/rideshare', data),
  updateRide: (id, data) => api.put(`/rideshare/${id}`, data),
  deleteRide: (id) => api.delete(`/rideshare/${id}`),
  joinRide: (id) => api.post(`/rideshare/${id}/join`),
  leaveRide: (id) => api.post(`/rideshare/${id}/leave`)
}

export const marketplaceAPI = {
  getItems: (params = {}) => api.get('/marketplace', { params }),
  getItem: (id) => api.get(`/marketplace/${id}`),
  createItem: (data) => api.post('/marketplace', data),
  updateItem: (id, data) => api.put(`/marketplace/${id}`, data),
  deleteItem: (id) => api.delete(`/marketplace/${id}`),
  purchaseItem: (id) => api.post(`/marketplace/${id}/purchase`)
}

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
}

export default api