<template>
  <div class="container" @click="toggleValue()">
    <span class="label"><slot></slot></span>
    <div class="switch-label" :class="{'checked': value}"><span></span></div>
    <input class="switch" type="checkbox" v-model="valueLocal" >
  </div>
</template>

<style lang="less" scoped>
  .container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    user-select: none;
    width: 60px;

    .label{
      width: 100%;
      text-align: center;
      display: block;
      user-select: none;
      font-size: 6px;
      padding: 0 2px;
      padding-bottom: 4px;
      color: rgba(41, 47, 51, 0.7);
    }

    .switch{
      display: none;
    }

    .switch-label{
      display: flex;
      justify-content: center;
      align-items: center;

      box-sizing: border-box;
      border: 1px solid #ccc;

      height: 28px;
      width: 28px;

      background: #eee;
      transition: .3s;

      span{
        text-align: center;
        font-size: 10px;
        line-height: 28px;
        font-weight: bold;
      }

      span:after{
        content: "OFF";
        color: #aaa;
      }

      &.checked{
        background: #78bd78;

        span:after{
          content: "ON";
          color: #fff;
        }
      }
    }
  }
</style>

<script>
export default{
  props:{
    value: Boolean,
  },

  data(){
    return{
      valueLocal: this.value
    }
  },

  setup(props, { emit }){
    const toggleValue = () => {
      emit('update:value', !props.value);
    };

    //onMounted(resetSelect);

    return {
      toggleValue
    }
  }
}
</script>
