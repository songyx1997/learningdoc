import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/home.vue';
import Person from '@/pages/person.vue';
import Help from '@/pages/help.vue';

const router = createRouter({
    history: createWebHashHistory(),
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