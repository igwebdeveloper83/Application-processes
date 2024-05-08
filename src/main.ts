import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'

import App from './App.vue'
import router from './router'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC89YnVjidBbd4l5WQ6iqY02SBnflUp5zc',
  authDomain: 'interviews-f0b40.firebaseapp.com',
  projectId: 'interviews-f0b40',
  storageBucket: 'interviews-f0b40.appspot.com',
  messagingSenderId: '670020396138',
  appId: '1:670020396138:web:e185a8615b5f6070959613'
}

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.component('app-menubar', Menubar)

app.mount('#app')
