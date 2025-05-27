import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'pptx',
      component: () => import('../views/PptxCompress.vue')
    },
    {
      path: '/audio',
      name: 'audio',
      component: () => import('../views/AudioCompress.vue')
    }
  ]
})

export default router 