import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/home.vue';
import Person from '@/views/person.vue';
import Help from '@/views/help.vue';

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