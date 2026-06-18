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
    {
      path: '/favorite',
      name: 'favorite',
      component: () => import('@/views/FavoriteView.vue'),
      meta: { title: '我的收藏' },
    },
    {
      path: '/opera-type/:operaType',
      name: 'opera-type',
      component: () => import('@/views/OperaTypeView.vue'),
      meta: { title: '剧种详情' },
    },
  ],
})

router.afterEach((to) => {
  let title = (to.meta.title as string) || '戏曲剧种与唱腔'
  if (to.name === 'opera-type' && to.params.operaType) {
    title = `${decodeURIComponent(to.params.operaType as string)} - 剧种详情`
  }
  document.title = title
})

export default router
