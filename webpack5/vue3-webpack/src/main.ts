import '@/assets/css/reset.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
app.use(router);
const pinia = createPinia();
app.use(pinia);
app.use(Antd);

app.mount('#app');