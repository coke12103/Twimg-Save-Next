import { createStore } from 'vuex'

export default createStore({
  state: {
    status_text: '起動していません',
    target_sns_text: ''
  },
  mutations: {
    set_status_text(state, text){
      state.status_text = text;
    },

    set_target_sns(state, text){
      state.target_sns_text = text;
    }
  },
  actions: {
  },
  modules: {
  }
})
