import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueRouter from 'vue-router';
import AudioRecorder from 'vue-audio-recorder'
import BootstrapVue from 'bootstrap-vue'

require('whatwg-fetch');
require('jquery');

Vue.use(BootstrapVue)
Vue.use(AudioRecorder)
Vue.use(VueAxios, axios)
Vue.use(VueRouter);
Vue.config.productionTip = false

import HomeComponent from './components/HomeComponent.vue';
import tts from './components/tts'
import visualRecognition from './components/visualrecognition'
import langageTranslate from './components/LangageTranslate'
import NaturalLangageUnderstand from './components/NaturalLangageUnderstand'
import toneAnalyzer from './components/toneAnalyser'
import speechToText from './components/speechtotext'
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
  },
  {
      name :'langagetranslate',
      path :'/langagetranslate',
      component : langageTranslate
  },
  {
    name :'NaturalLangageUnderstand',
    path :'/nlu',
    component : NaturalLangageUnderstand
    },
    {
    name :'toneAnalyser',
    path :'/tonea',
    component : toneAnalyzer
    },
    {
    name :'speechToText',
    path :'/speech',
    component : speechToText
    }
];

const router = new VueRouter({ mode: 'history', routes: routes});
new Vue(Vue.util.extend({ router }, App)).$mount('#app');
// new Vue({
//   render: h => h(App),
// }).$mount('#app')
