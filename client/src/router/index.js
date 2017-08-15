import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import RelationshipWrapper from '@/components/RelationshipWrapper'
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
      path: '/:relationship_id*/edit',
      component: RelationshipWrapper,
      props: route => ({ relationship_id: route.params.relationship_id, edit: true })
    },
    {
      path: '/:relationship_id*',
      component: RelationshipWrapper,
      props: true
    }
  ]
})
