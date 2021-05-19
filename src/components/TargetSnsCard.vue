<template>
  <ui-card class="target-sns-card">
    ターゲットSNS: <span class="target-sns-text">{{ $store.state.target_sns_text }}</span>
  </ui-card>
</template>

<style lang="less" scoped>
  .target-sns-card{
    font-size: 14px;
    color: rgba(41, 47, 51, 0.7);
    user-select: none;

    .target-sns-text{
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
