import { AmbientLight, Color, GridHelper, Scene } from 'three'
import { InteractionManager } from 'three.interactive'

import Camera from './camera'
// import Cube from './primitives/cube'
import OBJObject from './objObject'
import Renderer from './renderer'

import store from '@/stores/three.store'

const main = async () => {
  const container = document.querySelector('#scene-container')

  if (!container) {
    return console.error('No container element found')
  }

  const renderer = new Renderer(container.clientWidth, container.clientHeight, window.devicePixelRatio)
  const camera = new Camera(container.clientWidth, container.clientHeight, 20, 60, 1, 10000, renderer)
  const interactionManager = new InteractionManager(renderer, camera.get(), renderer.domElement, false)

  const scene = new Scene()
  scene.background = new Color(0xf9fafb)

  const light = new AmbientLight(0x404040)
  light.intensity = 5
  scene.add(light)

  const wheel = new OBJObject()
  await wheel.load('wheel1')
  interactionManager.add(wheel.object)
  scene.add(wheel.object)

  const gridHelper = new GridHelper(63, 63)
  scene.add(gridHelper)

  {
    document.addEventListener('mousedown', (event) => event.preventDefault())
    wheel.object.addEventListener('click', () => console.debug(wheel.object.position))
  }

  {
    document.addEventListener(
      'keydown',
      (e) => e.key === 'c' && (store.viewMode = store.viewMode === 'perspective' ? 'orthographic' : 'perspective')
    )
    document.addEventListener(
      'keydown',
      (e) => e.key === 'q' && (store.controlsMode = store.controlsMode === 'orbit' ? 'pan' : 'orbit')
    )
    document.addEventListener('keydown', (e) => e.key === 'r' && camera.reset())
    document.addEventListener('keydown', (e) => e.key === 'g' && store.toggleGrid())
  }

  {
    window.addEventListener('resize', () => {
      camera.resize(container.clientWidth, container.clientHeight)
      renderer.setSize(container.clientWidth, container.clientHeight)
    })
  }

  const animate = () => {
    requestAnimationFrame(animate)

    camera.update()
    gridHelper.visible = store.showGrid
    renderer.render(scene, camera.get())
  }

  container.append(renderer.domElement)
  animate()
}

export default main
