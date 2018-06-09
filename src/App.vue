<template>
  <div>
    <Loading v-model="isLoading"></Loading>
    <div v-if='toast' class="toast">{{toast}}</div>
    <transition>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  import {toast} from './lib/Events'
  export default {
    name: 'app',
    data: function () {
      return {
        isLoading: false,
        loadNum: 0,
        toast: ""
      }
    },
    components: {
      Loading
    },
    methods: {
      load() {
        this.loadNum = this.loadNum + 1;
        this.isLoading = true;
      },
      loaded() {
        this.loadNum = this.loadNum - 1;
        if (this.loadNum <= 0) {
          this.loadNum = 0;
          this.isLoading = false;
        }
      }
    },
    created: function(){
      this.$router.beforeEach((to, from, next)=>{
        this.load();
        next()
      })
      this.$router.afterEach((to)=>{
        this.loaded();
      })
      window.appEvent.on('load', ()=>{
        this.load();
      })
      window.appEvent.on('loaded', ()=>{
        this.loaded();
      })
      window.appEvent.on('toast', (text)=>{
        this.toast = text;
        setTimeout(() => {
          this.toast = "";
        }, 2000)
      })
    }
  }
</script>
