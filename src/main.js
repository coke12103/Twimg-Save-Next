import { createApp } from 'vue';

import App from './App.vue';

import uiCard from './components/ui/card.vue';

const app = createApp(App);

app.component('ui-card', uiCard);

app.mount('#app');


