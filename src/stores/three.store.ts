import { reactive } from 'vue'

export interface IThreeStore {
  viewMode: 'perspective' | 'orthographic'
  controlsMode: 'orbit' | 'pan'
  showGrid: boolean
  shouldResetCamera: boolean
  changeViewMode: (mode: 'perspective' | 'orthographic') => void
  changeControlsMode: (mode: 'orbit' | 'pan') => void
  resetCamera: () => void
  setCameraReset: () => void
  toggleGrid: () => void
}

const initialData: IThreeStore = {
  viewMode: 'perspective',
  controlsMode: 'orbit',
  showGrid: true,
  shouldResetCamera: false,
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
  }
}

const store = reactive(initialData)

export default store
