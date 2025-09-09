// ���s��w�p

// Token�
export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// (7�o�
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('�(7�o1%:', error)
      return null
    }
  }
  return null
}

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

// ��/&�{U
export const isAuthenticated = () => {
  const token = getAuthToken()
  const user = getCurrentUser()
  return !!(token && user)
}

// ��token/&�
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Token�1%:', error)
    return true
  }
}

// {�
export const logout = () => {
  removeAuthToken()
  window.location.href = '/login'
}

// ��(7CP
export const hasPermission = (permission) => {
  const user = getCurrentUser()
  if (!user || !user.permissions) return false
  return user.permissions.includes(permission)
}

// ��(7�r
export const hasRole = (role) => {
  const user = getCurrentUser()
  if (!user || !user.role) return false
  return user.role === role
}

// <(7>:�
export const getUserDisplayName = (user = null) => {
  const currentUser = user || getCurrentUser()
  if (!currentUser) return '*�(7'
  
  return currentUser.displayName || 
         currentUser.username || 
         currentUser.email || 
         '*�(7'
}

// �宱���
export const isEmailVerified = (user = null) => {
  const currentUser = user || getCurrentUser()
  return currentUser?.emailVerified === true
}

// ��(74�URL
export const getUserAvatar = (user = null) => {
  const currentUser = user || getCurrentUser()
  return currentUser?.avatar || '/default-avatar.png'
}

// �{�token��	
export const handleTokenExpiration = () => {
  const token = getAuthToken()
  if (token && isTokenExpired(token)) {
    logout()
    return true
  }
  return false
}

// �1�k���p
export const requireAuth = () => {
  if (!isAuthenticated() || handleTokenExpiration()) {
    return false
  }
  return true
}

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getCurrentUser,
  setCurrentUser,
  isAuthenticated,
  isTokenExpired,
  logout,
  hasPermission,
  hasRole,
  getUserDisplayName,
  isEmailVerified,
  getUserAvatar,
  handleTokenExpiration,
  requireAuth
}