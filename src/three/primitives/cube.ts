import { BoxGeometry, LineBasicMaterial, Mesh } from 'three'

import Outline from './outline'

export default class Cube extends Mesh {
  private showOutline = false

  outline!: Outline

  constructor(w: number, h: number, d: number, color: string) {
    const geometry = new BoxGeometry(w, h, d)
    const material = new LineBasicMaterial({ color, linewidth: 2 })
    geometry.computeBoundingBox()

    super(geometry, material)

    this.castShadow = true
    this.receiveShadow = true
    this.translateY(h / 2)
    this.outline = new Outline(this, 1, 'black')
    this.outline.translateY(h / 2)
  }

  toggleOutline() {
    this.showOutline = !this.showOutline
    this.outline.visible = this.showOutline
  }
}
