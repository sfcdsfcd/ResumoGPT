import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import '../src/assets/styles/main.scss'
import { createBootstrap, BCard, BButton, BFormInput, BFormSelect } from 'bootstrap-vue-next'

const app = createApp(App)
app.use(router)
app.use(createBootstrap())
app.component('BCard', BCard)
app.component('BButton', BButton)
app.component('BFormInput', BFormInput)
app.component('BFormSelect', BFormSelect)
app.mount('#app')
