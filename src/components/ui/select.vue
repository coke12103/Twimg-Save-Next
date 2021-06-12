<template>
  <div class="select-area">
    <select @change="updateValue($event.target.value)">
      <option v-for="(option, index) in options" :value="option.id" :key="index">
        {{ option.name }}
      </option>
    </select>
    <span class="select-label"><slot></slot></span>
    <div class="underline"></div>
  </div>
</template>

<style lang="less" scoped>
  .select-area{
    width: 100%;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    user-select: none;

    select{
      width: 100%;
      border: none;
      padding: 0px 5px 5px 0;

      box-sizing: border-box;

      background: rgba(0,0,0,0);

      order: 1;

      appearance: none;

      &:focus{
        box-shadow: none;
        outline: none;
      }
    }

    .select-label{
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

    select:focus{
      ~ .underline{
        &::before,
        &::after{
          width: 50%;
        }
      }

      ~ .select-label{
        color: #5BE0E8;
      }
    }
  }
</style>

<script>
import { onMounted } from 'vue';

export default{
  props:{
    value: String,
    options: Array
  },
  setup(props, { emit }){
    const updateValue = (value) => emit('update:value', value);

    const resetSelect = function(){
      emit('update:value', props.options[0].id);
    };

    onMounted(resetSelect);

    return {
      updateValue
    }
  }
}
</script>

