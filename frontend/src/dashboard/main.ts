import { createApp } from 'vue';
import App from './App.vue';
import '../assets/styles/main.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createBootstrap, BCard, BButton, BFormInput } from 'bootstrap-vue-next';

const app = createApp(App);
app.use(createBootstrap());
app.component('BCard', BCard);
app.component('BButton', BButton);
app.component('BFormInput', BFormInput);
app.mount('#app');
