import { createApp } from 'vue'
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/core'
import yamlLang from 'highlight.js/lib/languages/yaml'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import App from './App.vue'

hljs.registerLanguage('yaml', yamlLang)

const app = createApp(App)
app.use(hljsVuePlugin)
app.mount('#app')
