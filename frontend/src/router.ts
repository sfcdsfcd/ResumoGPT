import { createRouter, createWebHistory } from 'vue-router'
import Popup from './popup/App.vue'
import Dashboard from './dashboard/App.vue'
import Ready from './ready/App.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/popup.html', component: Popup },
    { path: '/dashboard.html', component: Dashboard },
    { path: '/dashboard', component: Dashboard },
    { path: '/ready.html', component: Ready },
    { path: '/ready', component: Ready },
    { path: '/', redirect: '/popup.html' }
  ]
})
