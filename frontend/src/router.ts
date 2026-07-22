import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'App',
            component: () => import('@/pages/application/views/App.vue'),
            redirect: { name: 'Home' },
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('@/pages/application/views/HomeView.vue'),
                },
                // ...dictionaryRoutes,
                {
                    path: '/:catchAll(.*)',
                    name: 'Unknown',
                    component: () => import('@/pages/application/views/UnknownView.vue'),
                },
            ],
        },
    ],
})

export default router
