import { createApp } from 'vue';

import App from './App.vue';
import store from './store/index.js';

import uiCard from './components/ui/card.vue';
import uiInput from './components/ui/input.vue';
import uiButton from './components/ui/button.vue';
import uiSelect from './components/ui/select.vue';
import uiSwitch from './components/ui/switch.vue';

const app = createApp(App);

app.component('ui-card', uiCard);
app.component('ui-input', uiInput);
app.component('ui-button', uiButton);
app.component('ui-select', uiSelect);
app.component('ui-switch', uiSwitch);

app.use(store);

app.mount('#app');


