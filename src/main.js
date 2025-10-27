import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// CSS global

import './styles/animations.css';
import '@splidejs/splide/dist/css/splide.min.css';

createApp(App).mount('#app')
import { useScrollReveal } from './composables/useScrollReveal.js'

const { initScrollReveal } = useScrollReveal()
initScrollReveal(document)
