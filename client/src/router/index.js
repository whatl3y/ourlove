import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Relationship from '@/components/Relationship'
import ReloadPage from '@/components/ReloadPage'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    { path: '/file/*', component: ReloadPage },
    { path: '/logout', component: ReloadPage },
    { path: '/oauth/*', component: ReloadPage },
    { path: '/redirect', component: ReloadPage },
    {
      path: '/:relationship_id*',
      name: 'Relationship',
      component: Relationship,
      props: true
    }
  ]
})
