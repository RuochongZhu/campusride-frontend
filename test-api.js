#!/usr/bin/env node

import { authAPI } from './src/utils/api.js'

console.log('🔍 测试CampusRide API连接...\n')

// 测试健康检查端点
async function testHealthCheck() {
  try {
    console.log('📡 测试健康检查端点...')
    const response = await fetch('/api/health')
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ 健康检查成功:', data.message)
      return true
    } else {
      console.log('❌ 健康检查失败:', data)
      return false
    }
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message)
    return false
  }
}

// 测试登录API
async function testLoginAPI() {
  try {
    console.log('📡 测试登录API...')
    await authAPI.login({
      email: 'demo@cornell.edu',
      password: 'demo1234'
    })
    console.log('✅ 登录API连接成功')
    return true
  } catch (error) {
    if (error.message.includes('网络请求失败')) {
      console.log('❌ 登录API连接失败:', error.message)
      return false
    } else {
      console.log('✅ 登录API连接成功 (收到预期的认证错误)')
      return true
    }
  }
}

// 主测试函数
async function runTests() {
  console.log('🧪 开始API连接测试...\n')
  
  const healthOk = await testHealthCheck()
  const loginOk = await testLoginAPI()
  
  console.log('\n📊 测试结果:')
  console.log(`健康检查: ${healthOk ? '✅' : '❌'}`)
  console.log(`登录API: ${loginOk ? '✅' : '❌'}`)
  
  if (healthOk && loginOk) {
    console.log('\n🎉 所有API测试通过！')
    process.exit(0)
  } else {
    console.log('\n❌ 部分API测试失败，请检查配置')
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
}