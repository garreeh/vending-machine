import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/cart',
    component: () => import('../views/CartPage.vue')
  },
  {
    path: '/payment',
    component: () => import('../views/PaymentPage.vue')
  },
  {
    path: '/dispensing',
    component: () => import('../views/DispensingPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
