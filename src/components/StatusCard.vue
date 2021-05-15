<template>
  <ui-card class="status-card">
    Status: <span class="status-text">{{status_text}}</span>
  </ui-card>
</template>

<style lang="less" scoped>
  .status-card{
    font-size: 14px;
    color: rgba(41, 47, 51, 0.7);
    user-select: none;

    .status-text{
      font-size: 14px;
      color: #000;
      margin-left: 5px;
      user-select: text;
    }
  }
</style>

<script>
export default{
  computed:{
    status_text(){
      return this.$store.state.status_text;
    }
  }
}
</script>
