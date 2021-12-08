<template>
  <ui-card class="quick-settings-card">
    <div class="qs-container">
      <ui-switch v-model:value="isCheckClipboardLocal" @click="on_clipboard_check_change">クリップボード監視</ui-switch>
    </div>
    <div class="border"></div>
    <div class="button-area">
      <ui-button v-model:value="settings_text" @click="open_settings"></ui-button>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
  .quick-settings-card{
    user-select: none;
    flex-direction: column;

    .qs-container,
    .button-area{
      display: flex;
    }

    .button-area{
      margin: 8px 12px;
    }

    .border{
      border-top: 1px solid rgba(0,0,0,.1);
      margin: 0;
    }
  }
</style>

<script>
/* eslint-disable */
import { onMounted, ref } from 'vue';
import store from '../store';

export default{
  props: ['is_check_clipboard', 'is_auto_download'],
  data(){
    return {
      isCheckClipboardLocal: this.is_check_clipboard,
      isAutoDownloadLocal: this.is_auto_download,
      settings_text: '設定'
    }
  },

  methods: {
    open_settings(){
    },

    on_clipboard_check_change(){
      window.api.emitClipboardCheckChange(this.isCheckClipboardLocal);
    }
  },

  setup(){
    const is_check_clipboard = ref(false);
    const is_auto_download = ref(false);

    const setupEvents = function(){
      window.api.onClipboardChange(function(text){
        console.log(text);
      });
    };

    onMounted(setupEvents);

    return { is_check_clipboard, is_auto_download };
  }
}
</script>
