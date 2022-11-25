import { BoxGeometry, LineBasicMaterial, Mesh } from 'three'

export default class Cube extends Mesh {
  constructor(w: number, h: number, d: number, color: string) {
    const geometry = new BoxGeometry(w, h, d)
    const material = new LineBasicMaterial({ color, linewidth: 2 })

    super(geometry, material)
  }
}
