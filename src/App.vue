<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <StatusCard></StatusCard>
  <TargetSnsCard></TargetSnsCard>
</template>

<script>
import { onMounted } from 'vue';
import store from './store';

import StatusCard from './components/StatusCard.vue';
import TargetSnsCard from './components/TargetSnsCard.vue';

export default {
  name: 'App',
  components: {
    StatusCard,
    TargetSnsCard
  },

  setup(){
    const setupEventListener = function(){
      window.api.onStatusTextChange(function(text){
        console.log(`%cstatus text:%c ${text}`, 'color: orange;', '');
        store.commit('set_status_text', text);
      });

      window.api.onTargetSnsChange(function(text){
        store.commit('set_target_sns', text);
      });

      window.api.onConsoleLog(function(arg){
        var content = Buffer.from(arg);
        console.log(`%ccore:%c ${content.toString()}`, 'color: orange;', '');
      })
    };

    onMounted(setupEventListener);
  }
}

</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;

  > *{
    margin-bottom: 10px;
  }
}
</style>
