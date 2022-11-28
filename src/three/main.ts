import { AmbientLight, Box3, Color, GridHelper, Group, MathUtils, Object3D, Scene, Vector3 } from 'three'
import { InteractionManager } from 'three.interactive'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { toRaw } from 'vue'

import Camera from './camera'
import Renderer from './renderer'

import type OBJObject from './objObject'

import store from '@/stores/three.store'

export default class Three {
  private readonly container: Element
  private readonly scene: Scene
  private readonly camera: Camera
  private readonly renderer: Renderer
  private readonly interactionManager: InteractionManager
  private readonly transformControls: TransformControls
  private readonly grid: GridHelper
  private readonly ambientLight: AmbientLight

  private selectedObject: Object3D | null = null
  private shiftDown = false
  private objectsCount = 0

  constructor(container: Element) {
    this.container = container

    {
      this.scene = new Scene()
      this.renderer = new Renderer(this.container.clientWidth, this.container.clientHeight, window.devicePixelRatio)
      this.camera = new Camera(this.container.clientWidth, this.container.clientHeight, 30, 60, 1, 10000, this.renderer)
      this.interactionManager = new InteractionManager(
        this.renderer,
        this.camera.get(),
        this.renderer.domElement,
        false
      )
      this.transformControls = new TransformControls(this.camera.get(), this.renderer.domElement)
      this.grid = new GridHelper(63, 63, 0x444444, 0x444444)
      this.ambientLight = new AmbientLight(0xffffff, 0.5)
    }

    {
      this.scene.background = new Color(0xf9fafb)
      this.ambientLight.intensity = 0.5
      this.transformControls.visible = false
      this.transformControls.mode = store.transformControls
    }

    {
      this.container.appendChild(this.renderer.domElement)
    }

    {
      this.scene.add(this.transformControls)
      this.scene.add(this.grid)
      this.scene.add(this.ambientLight)
    }

    this.addEventListeners()
  }

  async render() {
    await this.initObjects()

    this.camera.update()
    this.grid.visible = store.showGrid
    this.transformControls.mode = store.transformControls
    this.renderer.render(this.scene, this.camera.get())

    requestAnimationFrame(this.render.bind(this))
  }

  private async initObjects() {
    if (store.objects.length === this.objectsCount) {
      return
    }

    for (const obj of store.objects.slice(this.objectsCount)) {
      await obj.load()

      const item = toRaw(obj) as OBJObject

      item.object.addEventListener('click', this.onObjectClick.bind(this, item))

      this.interactionManager.add(item.object)
      this.scene.add(toRaw(item.object))
    }

    this.objectsCount = store.objects.length
  }

  private computeTransformControlsCenter(object: Object3D) {
    const aabb = new Box3().setFromObject(object)
    const position = aabb.getCenter(new Vector3())
    position.y /= 2

    this.transformControls.position.copy(position)
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
    window.addEventListener('keyup', this.onKeyUp.bind(this), false)

    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.camera.controls.enabled = !event.value
    })

    // this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false)
  }

  private onKeyDown(event: KeyboardEvent) {
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
        this.transformControls.setTranslationSnap(1)
        this.transformControls.setRotationSnap(MathUtils.degToRad(15))
        this.shiftDown = true
        break
      case 'Backspace':
        if (!this.selectedObject) {
          break
        }

        if (this.selectedObject.name === 'selected-object') {
          this.selectedObject.children.forEach((child) => {
            this.scene.remove(child)
          })
        }

        this.scene.remove(this.selectedObject)
        this.transformControls.detach()
        this.selectedObject = null

        break
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'Shift':
        this.transformControls.setTranslationSnap(null)
        this.transformControls.setRotationSnap(null)
        this.shiftDown = false
        break
    }
  }

  private onWindowResize() {
    this.camera.update()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private onObjectClick(item: OBJObject) {
    if (this.selectedObject?.name === 'selected-object') {
      if (this.shiftDown) {
        if (this.selectedObject.children.find((child) => child.id === item.object.id)) {
          this.scene.add(item.object)
          this.selectedObject.remove(item.object)

          item.object.position.add(this.selectedObject.position)
          item.object.rotation.copy(this.selectedObject.rotation)
        } else {
          this.selectedObject.add(item.object)
        }
      } else {
        this.selectedObject.children.forEach((child) => {
          if (!this.selectedObject) {
            return
          }

          this.scene.add(child)
          this.selectedObject.remove(child)

          child.position.add(this.selectedObject.position)
          child.rotation.copy(this.selectedObject.rotation)
        })

        this.selectedObject = item.object
      }
    } else if (this.selectedObject && this.shiftDown) {
      const group = new Group()
      const tmp = this.selectedObject

      group.name = 'selected-object'
      this.selectedObject = group

      group.add(tmp)
      group.add(item.object)
      this.scene.add(group)
    } else if (this.selectedObject?.id === item.object.id) {
      this.selectedObject = null
    } else {
      this.selectedObject = item.object
    }

    if (this.selectedObject) {
      this.computeTransformControlsCenter(this.selectedObject)

      this.transformControls.visible = true
      this.transformControls.attach(this.selectedObject)
    } else {
      this.transformControls.visible = false
      this.transformControls.detach()
    }
  }
}
