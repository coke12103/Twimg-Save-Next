import { createApp } from 'vue';

import App from './App.vue';
import store from './store/index.js';

import uiCard from './components/ui/card.vue';

const app = createApp(App);

app.component('ui-card', uiCard);

app.use(store);

app.mount('#app');


