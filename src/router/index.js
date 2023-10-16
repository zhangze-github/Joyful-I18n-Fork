import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import('../page/home/index.vue'),
            redirect: { name: 'list' },
            children: [
                {
                    path: 'list',
                    name: 'list',
                    component: () =>
                        import('../page/list/index.vue'),
                },
                {
                    path: 'lang',
                    name: 'lang',
                    component: () =>
                        import('../page/lang/index.vue'),
                }
            ],
        },
        {
            path: '/:w+',
            redirect: { name: 'home' },
        },
        {
            path: '/',
            redirect: { name: 'home' },
        },
    ],
})

export default router
