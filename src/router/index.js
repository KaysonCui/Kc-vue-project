import VueRouter from 'vue-router'
import notFound from './404'
import home from './home'
let routes = [home, notFound]
routes = [...routes, {
  path: '*',
  redirect: '/404'
}];
export default new VueRouter({
  routes
})