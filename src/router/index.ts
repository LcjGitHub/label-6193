import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '戏曲剧种与唱腔' },
    },
    {
      path: '/play/:id',
      name: 'play',
      component: () => import('@/views/PlayView.vue'),
      meta: { title: '曲目播放' },
    },
  ],
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || '戏曲剧种与唱腔'
  document.title = title
})

export default router
