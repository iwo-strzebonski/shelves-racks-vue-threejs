import { WebGLRenderer } from 'three'

export default class Renderer extends WebGLRenderer {
  constructor(w: number, h: number, ratio: number) {
    super()

    this.setSize(w, h)
    this.setPixelRatio(ratio)
  }
}
