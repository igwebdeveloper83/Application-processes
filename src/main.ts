import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

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
app.use(ToastService)

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress-spinner', ProgressSpinner)

app.mount('#app')
