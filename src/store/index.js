import { createStore } from 'vuex'

export default createStore({
  state: {
    status_text: '起動していません',
    target_sns_text: '',
    current_url: '',
    current_category: '',
    queue_count: 0
  },
  mutations: {
    set_status_text(state, text){
      state.status_text = text;
    },

    set_target_sns(state, text){
      state.target_sns_text = text;
    },

    set_current_url(state, text){
      state.current_url = text;
    },

    set_current_category(state, text){
      state.current_category = text;
    },

    set_queue_count(state, text){
      state.queue_count = text;
    }
  },
  actions: {
  },
  modules: {
  }
})
