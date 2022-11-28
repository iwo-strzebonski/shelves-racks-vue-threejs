import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUpDownLeftRight,
  faCameraRotate,
  faCube,
  faVectorSquare,
  faArrowsRotate,
  faBars,
  faBorderAll,
  faBorderNone,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VTooltip } from 'v-tooltip'
import { createApp } from 'vue'

import App from './App.vue'
import './assets/main.css'
import './extensions/string.extensions'
import Three from './three/main'

library.add(faUpDownLeftRight)
library.add(faCameraRotate)
library.add(faCube)
library.add(faVectorSquare)
library.add(faArrowsRotate)
library.add(faBars)
library.add(faBorderAll)
library.add(faBorderNone)
library.add(faRotateRight)

const app = createApp(App)

app.directive('tooltip', VTooltip)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

const container = document.querySelector('#scene-container')

if (container) {
  const three = new Three(container)
  await three.render()
}
