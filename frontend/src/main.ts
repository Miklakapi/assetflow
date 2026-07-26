import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import AppSpinner from './components/AppSpinner.vue'
import logDirective from './directives/log'
import router from './router'

import '@/assets/styles/main.css'

const app = createApp(App)

app.component('AppSpinner', AppSpinner)
app.directive('log', logDirective)

app.use(createPinia())
app.use(router)

router.isReady().then(function () {
    app.mount('#app')
})
