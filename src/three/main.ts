import { AmbientLight, Box3, Color, GridHelper, Group, MathUtils, Object3D, Scene, Vector3 } from 'three'
import { InteractionManager } from 'three.interactive'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { toRaw } from 'vue'

import Camera from './camera'
import Renderer from './renderer'

import store from '@/stores/three.store'

const main = async () => {
  const container = document.querySelector('#scene-container')

  let selectedObject: Object3D | null = null
  let shiftDown = false

  if (!container) {
    return console.error('No container element found')
  }

  const renderer = new Renderer(container.clientWidth, container.clientHeight, window.devicePixelRatio)
  const camera = new Camera(container.clientWidth, container.clientHeight, 30, 60, 1, 10000, renderer)
  const interactionManager = new InteractionManager(renderer, camera.get(), renderer.domElement, false)
  const scene = new Scene()
  const light = new AmbientLight(0x404040)
  const gridHelper = new GridHelper(63, 63)
  const transformControls = new TransformControls(camera.get(), renderer.domElement)

  let objectsCount = 0

  container.append(renderer.domElement)

  {
    scene.background = new Color(0xf9fafb)
    light.intensity = 4.5
    transformControls.visible = false
  }

  {
    transformControls.addEventListener('dragging-changed', (event) => {
      camera.controls.enabled = !event.value
    })
  }

  {
    scene.add(light)
    scene.add(gridHelper)
    scene.add(transformControls)
  }

  {
    const keydownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'c':
          return store.changeViewMode(store.viewMode === 'orthographic' ? 'perspective' : 'orthographic')
        case 'q':
          return store.changeControlsMode(store.controlsMode === 'orbit' ? 'pan' : 'orbit')
        case 'r':
          return store.resetCamera()
        case 'g':
          return store.toggleGrid()
        case 't':
          return store.changeTransformControls(store.transformControls === 'translate' ? 'rotate' : 'translate')
        case 'Shift':
          transformControls.setTranslationSnap(1)
          transformControls.setRotationSnap(MathUtils.degToRad(15))
          shiftDown = true
          break
        case 'Backspace':
          if (!selectedObject) {
            break
          }

          if (selectedObject.name === 'selected-object') {
            selectedObject.children.forEach((child) => {
              scene.remove(child)
            })
          }

          scene.remove(selectedObject)
          transformControls.detach()
          selectedObject = null

          break
      }
    }

    const keyupHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Shift':
          transformControls.setTranslationSnap(null)
          transformControls.setRotationSnap(null)
          shiftDown = false
          break
      }
    }

    document.addEventListener('keydown', keydownHandler)
    document.addEventListener('keyup', keyupHandler)
  }

  {
    window.addEventListener('resize', () => {
      camera.resize(container.clientWidth, container.clientHeight)
      renderer.setSize(container.clientWidth, container.clientHeight)
    })
  }

  const computeTransformControlsCenter = (object: Object3D) => {
    const aabb = new Box3().setFromObject(object)
    const position = aabb.getCenter(new Vector3())
    position.y /= 2

    transformControls.position.copy(position)
  }

  const initObjects = async () => {
    if (store.objects.length === objectsCount) {
      return
    }

    for (const obj of store.objects.slice(objectsCount)) {
      await obj.load()

      const item = toRaw(obj)

      item.object.addEventListener('click', () => {
        if (selectedObject?.name === 'selected-object') {
          if (shiftDown) {
            if (selectedObject.children.find((child) => child.id === item.object.id)) {
              scene.add(item.object)
              selectedObject.remove(item.object)

              item.object.position.add(selectedObject.position)
            } else {
              selectedObject.add(item.object)
            }
          } else {
            selectedObject.children.forEach((child) => {
              if (!selectedObject) {
                return
              }

              scene.add(child)
              selectedObject.remove(child)

              child.position.add(selectedObject.position)
            })

            selectedObject = item.object
          }
        } else if (selectedObject && shiftDown) {
          const group = new Group()
          const tmp = selectedObject

          group.name = 'selected-object'
          selectedObject = group

          group.add(tmp)
          group.add(item.object)
          scene.add(group)
        } else if (selectedObject?.id === item.object.id) {
          selectedObject = null
        } else {
          selectedObject = item.object
        }

        if (selectedObject) {
          computeTransformControlsCenter(selectedObject)

          transformControls.visible = true
          transformControls.attach(selectedObject)
        } else {
          transformControls.visible = false
          transformControls.detach()
        }
      })

      interactionManager.add(item.object)
      scene.add(toRaw(item.object))
    }

    objectsCount = store.objects.length
  }

  const render = () => {
    initObjects()

    camera.update()
    gridHelper.visible = store.showGrid
    renderer.render(scene, camera.get())

    requestAnimationFrame(render)
  }

  render()
}

export default main
