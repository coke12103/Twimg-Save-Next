<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <StatusCard></StatusCard>
</template>

<script>
import { onMounted } from 'vue';
import store from './store';

import StatusCard from './components/StatusCard.vue'

export default {
  name: 'App',
  components: {
    StatusCard
  },

  setup(){
    const setupEventListener = function(){
      window.api.onStatusTextChange(function(text){
        console.log(text);
        store.commit('set_status_text', text);
      });
    };

    onMounted(setupEventListener);
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
