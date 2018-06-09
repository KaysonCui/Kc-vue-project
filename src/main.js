import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import Env from './lib/Env'
import "./index.less"
window.Env = new Env(window)
var attachFastClick = require('fastclick')
attachFastClick.attach(document.body)
start()

function start() {
  Vue.use(VueRouter)
  let router = require('./router').default
  Vue.use(Vuex)
  let store = require('./store').default
  var app = new Vue({
    el: '#app',
    router,
    store,
    ...App
  })
}