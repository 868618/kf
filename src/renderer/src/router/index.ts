import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@renderer/components/Layout/index.vue'

const findComponent = (path: string) => import(`@renderer/views/${path}/index.vue`)

const routes = [
  {
    path: '/',
    component: () => findComponent('createDocx')
    // component: () => import('@renderer/views/index/index.vue')
  }

  // {
  //   path: '/wifi',
  //   component: () => findComponent('wifi')
  // },

  // {
  //   path: '/dashboard',
  //   component: () => findComponent('dashboard')
  // },

  // {
  //   path: '/pdfPreview',
  //   component: () => findComponent('pdfPreview')
  // },

  // {
  //   path: '/directory',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => findComponent('directory'),
  //       alias: '/directory'
  //     }
  //   ]
  // },

  // {
  //   path: '/createDocx',
  //   component: () => findComponent('createDocx')
  //   // component: Layout,
  //   // children: [
  //   //   {
  //   //     path: 'index',
  //   //     component: () => findComponent('createDocx')
  //   //   }
  //   // ]
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
