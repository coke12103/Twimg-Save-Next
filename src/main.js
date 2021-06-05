import { createApp } from 'vue';

import App from './App.vue';
import store from './store/index.js';

import uiCard from './components/ui/card.vue';
import uiInput from './components/ui/input.vue';
import uiButton from './components/ui/button.vue';

const app = createApp(App);

app.component('ui-card', uiCard);
app.component('ui-input', uiInput);
app.component('ui-button', uiButton);

app.use(store);

app.mount('#app');


