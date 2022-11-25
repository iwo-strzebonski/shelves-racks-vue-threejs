import { Color, PerspectiveCamera, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Cube from './primitives/cube'
import Outline from './primitives/outline'
import Renderer from './renderer'

const main = () => {
  const container = document.querySelector('#scene-container')

  if (!container) {
    return console.error('No container element found')
  }

  const renderer = new Renderer(container.clientWidth, container.clientHeight, window.devicePixelRatio)

  const scene = new Scene()
  scene.background = new Color('#27272a')

  const camera = new PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 10)

  const cube = new Cube(2, 2, 2, 'white')
  const outline = new Outline(cube, 2, 'black')
  scene.add(cube)
  scene.add(outline)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.update()

  const animate = () => {
    requestAnimationFrame(animate)

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update()

    renderer.render(scene, camera)
  }

  container.append(renderer.domElement)
  animate()
}

export default main
