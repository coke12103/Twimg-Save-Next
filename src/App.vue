<template>
  <StatusCard></StatusCard>
  <TargetSnsCard></TargetSnsCard>
  <UrlInputCard></UrlInputCard>
  <CategoryCard></CategoryCard>
  <QueueCard></QueueCard>
  <QuickSettingsCard></QuickSettingsCard>
</template>

<script>
import { onMounted } from 'vue';
import store from './store';

import StatusCard from './components/StatusCard.vue';
import TargetSnsCard from './components/TargetSnsCard.vue';
import UrlInputCard from './components/UrlInputCard.vue';
import CategoryCard from './components/CategoryCard.vue';
import QueueCard from './components/QueueCard.vue';
import QuickSettingsCard from './components/QuickSettingsCard';

export default {
  name: 'App',
  components: {
    StatusCard,
    TargetSnsCard,
    UrlInputCard,
    CategoryCard,
    QueueCard,
    QuickSettingsCard
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

      window.api.onQueueUpdate(function(queue_list){
        console.log(queue_list);

        let count = 0;
        for(var cat in queue_list){
          count += queue_list[cat].length;
        }

        store.commit('set_queue_count', count);
      })

      window.api.onConsoleLog(function(arg){
        var content = Buffer.from(arg);
        console.log(`%ccore:%c ${content.toString()}`, 'color: orange;', '');
      });
    };

    onMounted(setupEventListener);
  }
}

</script>

<style lang="less">
#app {
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  align-items: center;

  > *{
    margin-bottom: 10px;
  }
}
</style>
