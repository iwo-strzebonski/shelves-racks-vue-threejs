import { reactive } from 'vue'

export interface IAssetStore {
  isMenuOpen: boolean
  toggleMenu: () => void
}

const initialData: IAssetStore = {
  isMenuOpen: false,
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }
}

const store = reactive(initialData)

export default store
