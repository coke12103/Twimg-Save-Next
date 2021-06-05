<template>
  <div class="input-area">
    <input :value="value" type="text" :placeholder="placeholder" @input="updateValue($event.target.value)">
    <span class="input-label"><slot></slot></span>
    <div class="underline"></div>
  </div>
</template>

<style lang="less" scoped>
  .input-area{
    width: 100%;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    user-select: none;

    input{
      width: 100%;
      border: none;
      outline: none;
      padding: 0;

      padding-bottom: 4px;
      box-sizing: border-box;

      order: 1;

      &:focus{
        box-shadow: none;
        outline: none;
      }
    }

    .input-label{
      width: 100%;
      text-align: left;
      display: block;
      user-select: none;
      font-size: 10px;
      padding-bottom: 4px;
      transition: all 0.25s;
      color: rgba(41, 47, 51, 0.7);

      order: 0;
    }

    .underline{
      position: relative;
      border-top: 1px solid rgba(102, 117, 127, 0.3);
      order: 2;

      &::before,
      &::after{
        position: absolute;
        bottom: 0px;
        width: 0px;
        height: 2px;
        content: '';
        background: #5BE0E8;
        transition: all 0.25s;
      }

      &::before{
        left: 50%;
      }

      &::after{
        right: 50%;
      }
    }

    input:focus{
      ~ .underline{
        &::before,
        &::after{
          width: 50%;
        }
      }

      ~ .input-label{
        color: #5BE0E8;
      }
    }
  }
</style>

<script>
export default{
  props:{
    value: String,
    placeholder: String
  },
  setup(_, { emit }){
    const updateValue = (value) => emit('update:value', value);

    return {
      updateValue
    }
  }
}
</script>

