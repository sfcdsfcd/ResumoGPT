import { createRouter, createWebHistory } from 'vue-router'
import Popup from './popup/App.vue'
import Dashboard from './dashboard/App.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/popup.html', component: Popup },
    { path: '/dashboard.html', component: Dashboard },
    { path: '/', redirect: '/popup.html' }
  ]
})
