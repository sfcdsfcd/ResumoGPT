import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import { BootstrapVueNext, BCard, BButton, BFormInput } from 'bootstrap-vue-next'

const app = createApp(App)
app.use(router)
app.use(BootstrapVueNext)
app.component('BCard', BCard)
app.component('BButton', BButton)
app.component('BFormInput', BFormInput)
app.mount('#app')
