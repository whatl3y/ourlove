import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Relationship from '@/components/Relationship'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:relationship_id*',
      name: 'Relationship',
      component: Relationship,
      props: true
    }
  ]
})
