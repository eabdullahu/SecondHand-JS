import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import VueCookies from 'vue-cookies'
import WishlistCookie from './plugins/WishlistCookie'
import Cart from './plugins/Cart'
import Search from './plugins/Search'
import * as VueGoogleMaps from 'vue2-google-maps'

import './axios'

Vue.use(Vuelidate)
Vue.use(VueCookies)
Vue.use(WishlistCookie)
Vue.use(Cart)
Vue.use(Search)
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyAeCQojPC1F_q36lnUADYIXnUh9igkFb1Q',
        libraries: 'places',
    }
});

import '@/design/style.css'
import '@/design/mobile.css'
import '@/design/font/flaticon.css'
import '@/design/font/flaticon.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')