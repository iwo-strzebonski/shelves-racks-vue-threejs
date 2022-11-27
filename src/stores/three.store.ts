import { reactive } from 'vue'

import type OBJObject from '@/three/objObject'

export interface IThreeStore {
  viewMode: 'perspective' | 'orthographic'
  controlsMode: 'orbit' | 'pan'
  showGrid: boolean
  shouldResetCamera: boolean
  transformControls: 'translate' | 'rotate'
  objects: OBJObject[]
  changeViewMode: (mode: 'perspective' | 'orthographic') => void
  changeControlsMode: (mode: 'orbit' | 'pan') => void
  resetCamera: () => void
  setCameraReset: () => void
  toggleGrid: () => void
  changeTransformControls: (mode: 'translate' | 'rotate') => void
  addObject: (object: OBJObject) => void
}

const initialData: IThreeStore = {
  viewMode: 'orthographic',
  controlsMode: 'orbit',
  showGrid: true,
  shouldResetCamera: false,
  transformControls: 'translate',
  objects: [],
  changeViewMode(mode: 'perspective' | 'orthographic') {
    this.viewMode = mode
  },
  changeControlsMode(mode: 'orbit' | 'pan') {
    this.controlsMode = mode
  },
  resetCamera() {
    this.shouldResetCamera = true
  },
  setCameraReset() {
    this.shouldResetCamera = false
  },
  toggleGrid() {
    this.showGrid = !this.showGrid
  },
  changeTransformControls(mode: 'translate' | 'rotate') {
    this.transformControls = mode
  },
  addObject(object: OBJObject) {
    this.objects.push(object)
  }
}

const store = reactive(initialData)

export default store
