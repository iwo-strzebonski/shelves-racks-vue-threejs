import { OrthographicCamera, PerspectiveCamera, type Renderer, MOUSE } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import store from '../stores/three.store'

export default class Camera {
  private clientWidth!: number
  private clientHeight!: number
  private aspect!: number
  private d!: number
  private fov!: number
  private near!: number
  private far!: number
  private perspectiveCamera!: PerspectiveCamera
  private orthographicCamera!: OrthographicCamera
  private camera!: PerspectiveCamera | OrthographicCamera
  private perspectiveControls!: OrbitControls
  private orthographicControls!: OrbitControls
  viewMode: 'perspective' | 'orthographic' = 'orthographic'
  controlsMode: 'orbit' | 'pan' = 'orbit'
  zoom = 1

  controls!: OrbitControls

  constructor(w: number, h: number, d: number, fov: number, near: number, far: number, renderer: Renderer) {
    this.clientWidth = w
    this.clientHeight = h
    this.aspect = w / h
    this.d = d
    this.fov = fov
    this.near = near
    this.far = far
    this.perspectiveCamera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far)
    this.orthographicCamera = new OrthographicCamera(
      -this.d * this.aspect,
      this.d * this.aspect,
      this.d,
      -this.d,
      this.near,
      this.far
    )

    this.camera = this.orthographicCamera
    this.camera.position.set(d, d, d)
    this.camera.lookAt(0, 0, 0)

    this.perspectiveControls = new OrbitControls(this.perspectiveCamera, renderer.domElement)
    this.orthographicControls = new OrbitControls(this.orthographicCamera, renderer.domElement)
    this.controls = this.orthographicControls
  }

  get() {
    return this.camera
  }

  update() {
    this.controls.update()
    this.zoom = this.orthographicCamera.zoom

    if (store.shouldResetCamera) {
      this.reset()
    }

    if (this.viewMode !== store.viewMode) {
      this.setViewMode(store.viewMode)
    }

    if (this.controlsMode !== store.controlsMode) {
      this.setControlsMode(store.controlsMode)
    }
  }

  reset() {
    this.perspectiveControls.reset()
    this.orthographicControls.reset()
    this.controls.reset()

    this.perspectiveCamera.position.set(this.d, this.d, this.d)
    this.orthographicCamera.position.set(this.d, this.d, this.d)
    this.camera.position.set(this.d, this.d, this.d)

    this.perspectiveCamera.lookAt(0, 0, 0)
    this.orthographicCamera.lookAt(0, 0, 0)
    this.camera.lookAt(0, 0, 0)

    store.shouldResetCamera = false
  }

  resize(w: number, h: number) {
    this.aspect = w / h
    this.perspectiveCamera.aspect = this.aspect
    this.perspectiveCamera.updateProjectionMatrix()

    this.orthographicCamera.left = -this.d * this.aspect
    this.orthographicCamera.right = this.d * this.aspect
    this.orthographicCamera.updateProjectionMatrix()

    this.camera = this.camera.type === 'PerspectiveCamera' ? this.perspectiveCamera : this.orthographicCamera

    const scale = w < h ? this.clientWidth / w : this.clientHeight / h

    this.camera.scale.set(scale, scale, scale)
  }

  setViewMode(mode: 'perspective' | 'orthographic') {
    this.viewMode = mode

    if (mode === 'orthographic') {
      this.orthographicCamera.position.copy(this.camera.position)
      this.orthographicCamera.quaternion.copy(this.camera.quaternion)
      this.orthographicCamera.updateProjectionMatrix()

      this.orthographicControls.position0.copy(this.controls.position0)
      this.orthographicControls.target.copy(this.controls.target)
      this.orthographicControls.update()

      this.camera = this.orthographicCamera
      this.controls = this.orthographicControls
    } else {
      this.perspectiveCamera.position.copy(this.camera.position)
      this.perspectiveCamera.quaternion.copy(this.camera.quaternion)
      this.perspectiveCamera.updateProjectionMatrix()

      this.perspectiveControls.position0.copy(this.controls.position0)
      this.perspectiveControls.target.copy(this.controls.target)
      this.perspectiveControls.update()

      this.camera = this.perspectiveCamera
      this.controls = this.perspectiveControls
    }
  }

  setControlsMode(mode: 'orbit' | 'pan') {
    this.controlsMode = mode

    if (mode === 'orbit') {
      this.controls.mouseButtons = {
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY
      }

      this.perspectiveControls.mouseButtons = {
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY
      }

      this.orthographicControls.mouseButtons = {
        LEFT: MOUSE.ROTATE,
        MIDDLE: MOUSE.DOLLY
      }
    } else {
      this.controls.mouseButtons = {
        LEFT: MOUSE.PAN,
        MIDDLE: MOUSE.DOLLY
      }

      this.perspectiveControls.mouseButtons = {
        LEFT: MOUSE.PAN,
        MIDDLE: MOUSE.DOLLY
      }
    }
  }

  dispose() {
    this.camera.clear()
    this.perspectiveCamera.clear()
    this.orthographicCamera.clear()

    this.perspectiveControls.dispose()
    this.orthographicControls.dispose()
    this.controls.dispose()
  }
}
