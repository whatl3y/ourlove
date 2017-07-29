// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import fetchDefaults from 'fetch-defaults'
import App from './App'
import router from './router'

// external components
import Toastr from 'vue-toastr'
import Datepicker from 'vuejs-datepicker'
import Dropzone from 'vue2-dropzone'

// css
import 'vue-toastr/src/vue-toastr.less'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.scss'

window.ourloveFetch = fetchDefaults(fetch, {credentials: 'same-origin'})

Vue.use(BootstrapVue)
Vue.component('vue-toastr', Toastr)
Vue.component('datepicker', Datepicker)
Vue.component('Dropzone', Dropzone)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
