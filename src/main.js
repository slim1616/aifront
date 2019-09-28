import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueRouter from 'vue-router';
   
Vue.use(VueAxios, axios)
Vue.use(VueRouter);
Vue.config.productionTip = false

import HomeComponent from './components/HomeComponent.vue';
import tts from './components/tts'
import visualRecognition from './components/visualrecognition'

const routes = [
  {
      name: 'home',
      path: '/',
      component: HomeComponent
  },
  {
      name: 'tts',
      path: '/tts',
      component: tts
  },
  {
      name: 'visualrecognition',
      path: '/vr',
      component: visualRecognition
  }
];

const router = new VueRouter({ mode: 'history', routes: routes});
new Vue(Vue.util.extend({ router }, App)).$mount('#app');
// new Vue({
//   render: h => h(App),
// }).$mount('#app')
