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
<!-- Right side with login form -->
<div class="w-full md:w-3/5 bg-white p-8 md:p-12">
<div class="max-w-md mx-auto">
<div class="flex items-center mb-6">
<h1 class="text-2xl font-bold text-[#B31B1B]">Campus Ride Home</h1>
</div>
<h2 class="text-2xl font-bold text-gray-900 mb-6">Log in</h2>
<form @submit.prevent="handleSignIn">
<div class="mb-4">
<label for="email" class="block text-sm font-medium text-gray-700 mb-1">University email address</label>
<input
type="email"
id="email"
v-model="email"
class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B31B1B] focus:border-transparent"
placeholder="name@university.edu"
required
/>
</div>
<div class="mb-6">
<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
<input
type="password"
id="password"
v-model="password"
class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B31B1B] focus:border-transparent"
required
/>
</div>
<button
type="submit"
class="w-full bg-[#B31B1B] hover:bg-[#8F1515] text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4 cursor-pointer whitespace-nowrap"
>
Sign In
</button>
</form>
<div class="relative flex items-center justify-center my-6">
<div class="border-t border-gray-300 absolute w-full"></div>
<span class="bg-white px-2 text-sm text-gray-500 relative">or</span>
</div>
<button
class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 mb-3 transition-colors duration-300 cursor-pointer whitespace-nowrap"
@click="signInWithGoogle"
>
<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
Sign in with Google
</button>
<button
class="w-full flex items-center justify-center bg-[#B31B1B] text-white rounded-md py-2 px-4 hover:bg-[#8F1515] transition-colors duration-300 cursor-pointer whitespace-nowrap"
@click="signInWithCampusID"
>
<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
</svg>
Sign in with Campus ID
</button>
<p class="mt-6 text-center text-sm text-gray-600">
Don't have an account?
<a href="#" class="font-medium text-[#B31B1B] hover:text-[#8F1515]">Sign up</a>
</p>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

// 修改后的登录函数 - 使用Vue Router跳转
const handleSignIn = () => {
  // 简化的登录验证
  if (email.value && password.value) {
    // 设置认证token
    localStorage.setItem('userToken', 'demo-token')
    localStorage.setItem('userData', JSON.stringify({
      email: email.value,
      name: 'Demo User'
    }))
    
    // 使用Vue Router跳转到主页，而不是window.location.href
    router.push('/')
  }
}

const signInWithGoogle = () => {
  // Google登录逻辑
  console.log('Sign in with Google clicked')
  // 模拟Google登录成功
  localStorage.setItem('userToken', 'google-token')
  router.push('/')
}

const signInWithCampusID = () => {
  // Campus ID登录逻辑
  console.log('Sign in with Campus ID clicked')
  // 模拟Campus ID登录成功
  localStorage.setItem('userToken', 'campus-token')
  router.push('/')
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
