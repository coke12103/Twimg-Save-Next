<template>
  <ui-card class="category-card">
    <div class="select-area">
      <ui-select v-model:value="currentCategoryLocal" v-model:options="categorys" @change="updateCategorys">カテゴリ</ui-select>
    </div>
    <div class="border"></div>
    <div class="button-area">
      <ui-button v-model:value="add_category_text" @click="add_category"></ui-button>
      <ui-button v-model:value="edit_category_text" @click="edit_category"></ui-button>
      <ui-button v-model:value="open_category_text" @click="open_category"></ui-button>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
  .category-card{
    user-select: none;
    flex-direction: column;

    .select-area,
    .button-area{
      display: flex;
    }

    .button-area{
      margin: 8px 12px;
    }

    .border{
      border-top: 1px solid rgba(0,0,0,.1);
      margin: 0;
    }
  }
</style>

<script>
import { onMounted, ref } from 'vue';
import store from '../store';

export default{
  props: ['current_category'],
  data(){
    return {
      categorysLocal: this.categorys,
      currentCategoryLocal: this.current_category,
      add_category_text: '追加',
      edit_category_text: '編集',
      open_category_text: '保存先を開く'
    }
  },

  methods: {
    add_category(){
    },
    edit_category(){
    },
    open_category(){
    },

    updateCategorys(){
      this.$store.commit('set_current_category', this.currentCategoryLocal);
    }
  },

  setup(){
    const categorys = ref([{ id: 'null', name: 'loading categorys...' }]);

    const setupCategorys = function(){
      window.api.onUpdateCategorys(function(new_categorys){
        categorys.value = new_categorys;
        store.commit('set_current_category', categorys.value[0].id);
      });

      window.api.requestCategorys();
    };

    onMounted(setupCategorys);

    return { categorys };
  }
}
</script>
