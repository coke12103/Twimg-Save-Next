<template>
  <ui-card class="url-input-card">
    <div class="input-area">
      <ui-input v-model:value="url" v-model:placeholder="placeholder" @change="updateUrl" @click.right.prevent="pasteUrl">URL</ui-input>
    </div>
    <div class="border"></div>
    <div class="button-area">
      <ui-button v-model:value="download_button_text" @click="download" @click.right.prevent="pasteUrl"></ui-button>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
  .url-input-card{
    user-select: none;
    flex-direction: column;

    .input-area,
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
import store from '../store';
import { ref } from 'vue';

export default{
  data(){
    return {
      placeholder: 'https://exmaple.com/text',
      download_button_text: 'Download!'
    }
  },

  methods: {
    download(){
      window.api.download({
        url: this.$store.state.current_url,
        category: this.$store.state.current_category
      });

      this.url = "";
      this.updateUrl();
    },

    async pasteUrl(){
      const url = await navigator.clipboard.readText();
      this.url = url;

      this.updateUrl();
    },

    updateUrl(){
      this.$store.commit('set_current_url', this.url);
    },
  },

  setup(){
    const url = ref(url);

    store.watch((state, getters) => state.current_url, () => {
      url.value = store.state.current_url;
    });

    return { url };
  }
}
</script>
