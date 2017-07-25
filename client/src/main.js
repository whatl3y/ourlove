// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './App'
import router from './router'

// external components
import Datepicker from 'vuejs-datepicker'
import Dropzone from 'vue2-dropzone'

// css
import './css/main.scss'
import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)
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
