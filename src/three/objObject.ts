import { Box3, Mesh, MeshPhongMaterial, type Group } from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// import Outline from './primitives/outline'

export default class OBJObject {
  private objLoader = new OBJLoader()
  private mtlLoader = new MTLLoader()
  private hoverMaterial = new MeshPhongMaterial({ color: 0x00ff00 })
  private selectMaterial = new MeshPhongMaterial({ color: 0xff0000 })
  private materials!: {
    [key: string]: MeshPhongMaterial
  }
  private file: string

  object!: Group
  texture!: string
  aabb!: Box3

  constructor(file: string) {
    this.file = file
  }

  set(object: Group) {
    this.object = object
    this.aabb = new Box3().setFromObject(this.object)
  }

  load() {
    const loadMtl = new Promise((resolve, reject) => {
      this.mtlLoader.load(
        `objects/${this.file}.mtl?raw`,
        (materials) => {
          materials.preload()

          this.objLoader.setMaterials(materials)
          this.materials = materials.materials as {
            [key: string]: MeshPhongMaterial
          }

          resolve(materials)
        },
        undefined,
        reject
      )
    })

    const loadObj = new Promise((resolve, reject) => {
      this.objLoader.load(
        `objects/${this.file}.obj?raw`,
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

  hover() {
    this.object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        ;(child as Mesh).material = this.hoverMaterial
      }
    })
  }

  select() {
    this.object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        ;(child as Mesh).material = this.selectMaterial
      }
    })
  }

  default() {
    this.object.traverse((child) => {
      if ((child as Mesh).isMesh) {
        ;(child as Mesh).material = this.materials[child.id]
      }
    })
  }
}
