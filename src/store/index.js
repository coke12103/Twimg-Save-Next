import { createStore } from 'vuex'

export default createStore({
  state: {
    status_text: '起動していません'
  },
  mutations: {
    set_status_text(state, text){
      state.status_text = text;
    }
  },
  actions: {
  },
  modules: {
  }
})
