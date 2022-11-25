import { LineBasicMaterial, Mesh, EdgesGeometry, LineSegments } from 'three'

export default class Outline extends LineSegments {
  constructor(mesh: Mesh, linewidth: number, color: string) {
    // const material = new LineBasicMaterial({ color, linewidth, depthTest: false })
    const material = new LineBasicMaterial({ color, linewidth })
    const geometry = new EdgesGeometry(mesh.geometry)

    super(geometry, material)
  }
}
