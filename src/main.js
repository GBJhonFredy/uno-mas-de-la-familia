import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init({
  duration: 1000,
  once: false,
  mirror: false
})

import './styles/animations.css';
import '@splidejs/splide/dist/css/splide.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'

createApp(App).mount('#app')


