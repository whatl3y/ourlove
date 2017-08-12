// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import fetchDefaults from 'fetch-defaults'
import * as FastClick from 'fastclick'
import App from './App'
import router from './router'

// external libraries and components
import 'whatwg-fetch'
import Toastr from 'vue-toastr'
import Dropzone from 'vue2-dropzone'
import Datepicker from './components/Datepicker'
import FormRequiredInput from './components/FormRequiredInput'
import HorizontalTimeline from './components/HorizontalTimeline'
import ZigzagTimeline from './components/ZigzagTimeline'

// css
import 'vue-toastr/src/vue-toastr.less'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.scss'

window.ourloveFetch = fetchDefaults(fetch, {credentials: 'same-origin'})

// Initiate FastClick for mobile devices to remove the built-in 300ms
// delay. Read more in https://github.com/ftlabs/fastclick
if ('addEventListener' in document)
  document.addEventListener('DOMContentLoaded', () => FastClick.attach(document.body), false)

Vue.use(BootstrapVue)
Vue.component('vue-toastr', Toastr)
Vue.component('datepicker', Datepicker)
Vue.component('Dropzone', Dropzone)
Vue.component('FormRequiredInput', FormRequiredInput)
Vue.component('HorTimeline', HorizontalTimeline)
Vue.component('ZigzagTimeline', ZigzagTimeline)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
