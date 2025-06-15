import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 这个配置告诉Vite如何处理Vue.js文件
export default defineConfig({
  plugins: [vue()], // 启用Vue.js支持
  base: './', // 确保构建后的文件可以在任何服务器上运行
})