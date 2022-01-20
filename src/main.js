

import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import store from './store/index'
import config from './config'
import { sync } from 'vuex-router-sync'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

import VueAuth from '@websanova/vue-auth'
import VueAxios from 'vue-axios'
import axios from 'axios'

import VueMoment from 'vue-moment'
import moment from 'moment'
import vuetify from './plugins/vuetify';

Vue.router = router

Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)
Vue.use(VueMoment, {moment})
Vue.use(VueAuth, {
  auth: {
    request: function () {
      return null
    },
    response: function (res) {
      return res.data.request_token || null
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: `${config.requestUrl}/authentication/token/new?api_key=${config.apiKey}`, method: 'GET' },
  fetchData: {url: `/`, method: 'POST', enabled: false},
  refreshData: {url: `/`, method: 'POST', enabled: false},
  tokenStore: ['localStorage']
})

sync(store, router)
Vue.config.productionTip = false


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");