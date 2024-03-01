import { createRouter, createWebHistory } from 'vue-router';
// 借助webpack实现懒加载
const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home.vue');
const Person = () => import(/* webpackChunkName: 'person' */ '@/views/person.vue');
const Help = () => import(/* webpackChunkName: 'help' */ '@/views/help.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/person',
            name: 'person',
            component: Person
        },
        {
            path: '/help',
            name: 'help',
            component: Help
        }
    ]
});

export default router;