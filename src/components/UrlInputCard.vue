<template>
  <ui-card class="url-input-card">
    <div class="input-area">
      <ui-input v-model:value="urlLocal" v-model:placeholder="placeholder" @change="updateUrl" @click.right.prevent="pasteUrl">URL</ui-input>
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

export default{
  props: ['url'],
  data(){
    return {
      urlLocal: this.url,
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
    },

    async pasteUrl(){
      const url = await navigator.clipboard.readText();
      this.urlLocal = url;

      this.updateUrl();
    },

    updateUrl(){
      this.$store.commit('set_current_url', this.urlLocal);
    },
  }
}
</script>
