import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import * as bootstrap from 'bootstrap'
import AlertifyPlugin from './plugins/alertify.js'
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import './assets/global.css'
window.bootstrap = bootstrap

createApp(App).use(AlertifyPlugin).use(router).mount('#app')
