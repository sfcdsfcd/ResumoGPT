import { createApp } from 'vue'
import '../assets/styles/main.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import { createBootstrap, BCard, BButton } from 'bootstrap-vue-next'
import App from './App.vue'
import { router } from '../router'

const app = createApp(App)
app.use(createBootstrap())
app.use(router)
app.component('BCard', BCard)
app.component('BButton', BButton)
app.mount('#app')
