import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@renderer/components/Layout/index.vue'

const findComponent = (path: string) => import(`@renderer/views/${path}/index.vue`)

const routes = [
  {
    path: '/',
    component: () => import('@renderer/views/index/index.vue')
  },

  {
    path: '/wifi',
    component: () => findComponent('wifi')
  },

  {
    path: '/dashboard',
    component: () => findComponent('dashboard')
  },

  {
    path: '/pdfPreview',
    component: () => findComponent('pdfPreview')
  },

  {
    path: '/directory',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => findComponent('directory'),
        alias: '/directory'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
