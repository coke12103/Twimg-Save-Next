<template>
  <div class="ui-card">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
  .ui-card{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,.2);
  }
</style>
