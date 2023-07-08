import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import './style.css'

const messages = {
    en: {
        hello: 'hello world'
    },
    ja: {
        hello: 'こんにちは、世界'
    }
}
const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'ja',
    messages,
})

const app = createApp(App);

app.use(i18n)
app.mount('#app')