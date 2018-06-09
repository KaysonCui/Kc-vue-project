export default {
  path: '/',
  component: function (resolve) {
    require(['../components/home.vue'], resolve)
  }
}