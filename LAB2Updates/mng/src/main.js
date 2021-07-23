import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import VueSimpleAlert from "vue-simple-alert";
import VueToast from 'vue-toast-notification';
Vue.config.productionTip = false


import './axios'

import '@/design/style.css'
import '@/design/mobile.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(Vuelidate)

library.add(fas);
Vue.use(VueSimpleAlert);
Vue.use(VueToast);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')