// ¤Áøs„åwýp

// Token¡
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

// (7áo¡
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('ã(7áo1%:', error)
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

// Àå/&ò{U
export const isAuthenticated = () => {
  const token = getAuthToken()
  const user = getCurrentUser()
  return !!(token && user)
}

// Àåtoken/&Ç
export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Tokenã1%:', error)
    return true
  }
}

// {ú
export const logout = () => {
  removeAuthToken()
  window.location.href = '/login'
}

// Àå(7CP
export const hasPermission = (permission) => {
  const user = getCurrentUser()
  if (!user || !user.permissions) return false
  return user.permissions.includes(permission)
}

// Àå(7Òr
export const hasRole = (role) => {
  const user = getCurrentUser()
  if (!user || !user.role) return false
  return user.role === role
}

// <(7>:ð
export const getUserDisplayName = (user = null) => {
  const currentUser = user || getCurrentUser()
  if (!currentUser) return '*å(7'
  
  return currentUser.displayName || 
         currentUser.username || 
         currentUser.email || 
         '*å(7'
}

// Àå®±ŒÁ¶
export const isEmailVerified = (user = null) => {
  const currentUser = user || getCurrentUser()
  return currentUser?.emailVerified === true
}

// ·Ö(74ÏURL
export const getUserAvatar = (user = null) => {
  const currentUser = user || getCurrentUser()
  return currentUser?.avatar || '/default-avatar.png'
}

// ê¨{útokenÇö	
export const handleTokenExpiration = () => {
  const token = getAuthToken()
  if (token && isTokenExpired(token)) {
    logout()
    return true
  }
  return false
}

// ï1ˆk…©ýp
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