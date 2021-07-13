<template>
  <ui-card class="queue-card">
    <span>残りキュー: <span class="queue-text">{{ $store.state.queue_count }}</span></span>
  </ui-card>
</template>

<style lang="less" scoped>
  .queue-card{
    font-size: 14px;
    color: rgba(41, 47, 51, 0.7);
    user-select: none;

    .queue-text{
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
  }
}
</script>
