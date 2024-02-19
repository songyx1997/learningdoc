import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { createPinia } from 'pinia';

const app = createApp(App);
// 全局注册路由
app.use(router);
const pinia = createPinia();
app.use(pinia);

app.mount('#app');
