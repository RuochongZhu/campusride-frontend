<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
      <!-- Left side with image -->
      <div class="hidden md:block w-2/5 bg-[#B31B1B] p-8 flex items-center justify-center">
        <div class="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src="https://public.readdy.ai/ai/img_res/081b30f0b98732b66b8b3cd229f310e5.jpg"
            alt="Campus Ride Home"
            class="object-cover w-full h-auto"
          />
        </div>
      </div>
      <!-- Right side with register form -->
      <div class="w-full md:w-3/5 bg-white p-8 md:p-12">
        <div class="max-w-md mx-auto">
          <div class="flex items-center mb-6">
            <h1 class="text-2xl font-bold text-[#B31B1B]">Campus Ride Home</h1>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
          
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
          </div>
          
          <!-- 成功提示 -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegister">
            <!-- 邮箱 -->
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Cornell Email Address</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B31B1B] focus:border-transparent"
                placeholder="your-netid@cornell.edu"
                required
              />
            </div>
            
            <!-- 密码 -->
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                v-model="form.password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B31B1B] focus:border-transparent"
                placeholder="8 characters, letters and numbers"
                required
              />
            </div>
            
            <!-- 确认密码 -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="form.confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B31B1B] focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-[#B31B1B] hover:bg-[#8F1515] text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
          
          <div class="relative flex items-center justify-center my-6">
            <div class="border-t border-gray-300 absolute w-full"></div>
            <span class="bg-white px-2 text-sm text-gray-500 relative">or</span>
          </div>
          
          <button
            @click="signUpWithGoogle"
            :disabled="isLoading"
            class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 mb-3 transition-colors duration-300 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          
          <button
            @click="signUpWithCampusID"
            :disabled="isLoading"
            class="w-full flex items-center justify-center bg-[#B31B1B] text-white rounded-md py-2 px-4 hover:bg-[#8F1515] transition-colors duration-300 disabled:opacity-50"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
            Sign up with Campus ID
          </button>
          
          <p class="mt-6 text-center text-sm text-gray-600">
            Already have an account?
          </p>
          <button
            @click="goToLogin"
            class="mt-3 w-full bg-white border-2 border-[#B31B1B] text-[#B31B1B] font-medium py-2 px-4 rounded-md hover:bg-[#B31B1B] hover:text-white transition-colors duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../utils/api.js'

const router = useRouter()

// 表单数据
const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 引入API工具

// 清除提示信息
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// 表单验证
const validateForm = () => {
  clearMessages()
  
  if (!form.value.email || !form.value.password || !form.value.confirmPassword) {
    errorMessage.value = '请填写所有必填字段'
    return false
  }
  
  // Cornell email validation
  if (!form.value.email.endsWith('@cornell.edu')) {
    errorMessage.value = '邮箱必须以 @cornell.edu 结尾'
    return false
  }
  
  // Password validation: exactly 8 characters, letters and numbers only
  if (form.value.password.length !== 8) {
    errorMessage.value = '密码必须是8位字符'
    return false
  }
  
  const passwordRegex = /^[a-zA-Z0-9]{8}$/
  if (!passwordRegex.test(form.value.password)) {
    errorMessage.value = '密码必须是8位字母和数字的组合'
    return false
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不匹配'
    return false
  }
  
  return true
}

// 处理注册
const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  clearMessages()
  
  try {
    const data = await authAPI.register({
      email: form.value.email,
      password: form.value.password
    })
    
    successMessage.value = '注册成功！请检查您的邮箱并点击验证链接。'
    
    // 3秒后提示用户检查邮箱
    setTimeout(() => {
      if (successMessage.value.includes('检查您的邮箱')) {
        successMessage.value += '\n\n如果您没有收到邮件，请检查垃圾邮件文件夹或联系管理员。'
      }
    }, 3000)
  } catch (error) {
    console.error('Registration error:', error)
    
    // 处理不同类型的错误
    if (error.message.includes('邮箱已被注册')) {
      errorMessage.value = error.message + '\n\n您可以直接使用演示账号登录：demo@cornell.edu / demo1234'
      localStorage.setItem('demo_user', JSON.stringify({
        email: form.value.email
      }))
    } else if (error.message.includes('网络请求失败')) {
      // 网络错误时提供演示模式
      errorMessage.value = '无法连接到服务器，注册功能暂时不可用。\n\n您可以使用演示账号体验系统：demo@cornell.edu / demo1234'
      
      // 保存用户信息到本地以备将来使用
      localStorage.setItem('demo_user', JSON.stringify({
        email: form.value.email
      }))
    } else {
      errorMessage.value = error.message || '注册失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// Google注册
const signUpWithGoogle = () => {
  clearMessages()
  // TODO: 实现Google OAuth注册
  errorMessage.value = 'Google注册功能开发中，请使用邮箱注册'
}

// Campus ID注册
const signUpWithCampusID = () => {
  clearMessages()
  // TODO: 实现Campus ID注册
  errorMessage.value = 'Campus ID注册功能开发中，请使用邮箱注册'
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 保留原有样式 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style> 