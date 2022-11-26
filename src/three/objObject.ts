import { Box3, Vector3, type Group } from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// import Outline from './primitives/outline'

export default class OBJObject {
  private objLoader = new OBJLoader()
  private mtlLoader = new MTLLoader()
  object!: Group
  texture!: string
  aabb!: Box3

  set(object: Group) {
    this.object = object
    this.aabb = new Box3().setFromObject(this.object)

    const h = this.aabb.getSize(new Vector3()).y
    this.object.translateY(Math.round(h) / 2 + 0.5)
  }

  load(url: string) {
    const loadMtl = new Promise((resolve, reject) => {
      this.mtlLoader.load(
        `objects/${url}.mtl?raw`,
        (materials) => {
          materials.preload()
          this.objLoader.setMaterials(materials)
          resolve(materials)
        },
        undefined,
        reject
      )
    })

    const loadObj = new Promise((resolve, reject) => {
      this.objLoader.load(
        `objects/${url}.obj?raw`,
        (object) => {
          this.set(object)
          resolve(object)
        },
        undefined,
        reject
      )
    })

    return Promise.all([loadMtl, loadObj])
  }
}
