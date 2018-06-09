export default {
  path: '/404',
  component: function (resolve) {
    require(['../components/404.vue'], resolve)
  }
}