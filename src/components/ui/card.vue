<template>
  <div class="ui-card">
    <slot></slot>
  </div>
</template>

<style lang="less">
  .ui-card{
    display: flex;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 3px 8px rgba(0,0,0,.2);
    box-sizing: border-box;
    width: calc(100% - 8px);
    align-items: stretch;

    > *{
      margin: 12px;
    }
  }
</style>
