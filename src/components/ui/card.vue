<template>
  <div class="ui-card">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
  .ui-card{
    display: flex;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,.2);
    padding: 12px;
    width: 90%;
    align-items: center;

    > *{
      padding-top: 0px;
      padding-bottom: 0px;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
</style>
