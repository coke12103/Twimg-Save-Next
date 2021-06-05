<template>
  <input type="button" class="button" :value="value">
</template>

<style lang="less" scoped>
  .button{
    background: #fff;
    padding: 0 8px;;
    color: #5BE0E8;
    height: 24px;
    border: none;
    position: relative;
    cursor: pointer;
    display: block;
    transition: background .1s ease;
    outline: none;
    font-size: 12px;
    text-decoration: none;

    &:hover{
      background: rgba(158,158,158,.2);
    }
  }
</style>

<script>
export default{
  props:{
    value: String,
  }
}
</script>
