import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 创建Vue应用实例并挂载到页面上
const app = createApp(App)
app.use(Antd) // 使用Ant Design组件库
app.mount('#app') // 将应用挂载到HTML中的#app元素