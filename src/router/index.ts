import { createRouter, createWebHistory } from 'vue-router'
import { routeSeoConfig } from './seo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/PptxCompress.vue'),
      meta: {
        seo: routeSeoConfig.home
      }
    },
    {
      path: '/audio',
      name: 'audio',
      component: () => import('../views/AudioCompress.vue'),
      meta: {
        seo: routeSeoConfig.audio
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/Faq.vue'),
      meta: {
        seo: routeSeoConfig.faq
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue'),
      meta: {
        seo: routeSeoConfig.about
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/Projects.vue'),
      meta: {
        seo: routeSeoConfig.projects
      }
    }
  ]
})

export default router 