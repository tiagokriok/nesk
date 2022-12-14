import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
  });
