import 'bootstrap';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { createApp } from 'vue';
import '../assets/styles/main.scss';
import App from './App.vue';

const app = createApp(App);
app.use(BootstrapVue3);
app.mount('#app');
