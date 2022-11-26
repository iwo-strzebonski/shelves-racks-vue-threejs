import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUpDownLeftRight,
  faCameraRotate,
  faCube,
  faVectorSquare,
  faArrowsRotate,
  faBars,
  faBorderAll,
  faBorderNone
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VTooltip } from 'v-tooltip'
import { createApp } from 'vue'

import App from './App.vue'
import './assets/main.css'
import initThree from './three/main'

library.add(faUpDownLeftRight)
library.add(faCameraRotate)
library.add(faCube)
library.add(faVectorSquare)
library.add(faArrowsRotate)
library.add(faBars)
library.add(faBorderAll)
library.add(faBorderNone)

const app = createApp(App)

app.directive('tooltip', VTooltip)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

initThree()
