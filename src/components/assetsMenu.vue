<script setup lang="ts">
import store from '../stores/asset.store'
import threeStore from '../stores/three.store'

import OBJObject from '@/three/objObject'

const capitalize = (str: string): string => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

interface ImportMetaFixed extends ImportMeta {
  globEager: (pattern: string) => string[]
  glob: (pattern: string) => string[]
}

const objectsCount: Record<string, number> = {}

const PluralToSingular: { [key: string]: string } = {
  angles: 'angle',
  feet: 'foot',
  profiles: 'profile',
  wheels: 'wheel'
}

const getObjectsCounts = () => {
  const objects = Object.keys((import.meta as ImportMetaFixed).glob('/public/objects/**/*.obj'))

  for (const obj of objects) {
    const end = obj.lastIndexOf('/')
    const start = obj.lastIndexOf('/', end - 1) + 1

    const type = obj.substring(start, end)

    if (objectsCount[type]) {
      objectsCount[type]++
    } else {
      objectsCount[type] = 1
    }
  }
}

getObjectsCounts()
</script>

<template>
  <div
    class="absolute left-0 top-20 inline-flex h-[calc(100vh_-_80px)] transition-all ease-in-out duration-500 motion-reduce:transition-none"
    v-bind:class="store.isMenuOpen ? 'w-[calc(25%_+_32px)]' : 'w-8 delay-50'"
  >
    <div class="transition-all w-[calc(100%_-_32px)] h-full bg-zinc-300">
      <div class="flex flex-col p-4" v-bind:class="store.isMenuOpen ? 'delay-200' : 'collapse'">
        <h2 class="self-center text-xl">Assets menu</h2>

        <div class="mt-4" v-for="(count, type) in objectsCount" :key="type">
          <h3 class="text-lg">{{ capitalize(type) }}</h3>

          <ul>
            <li v-for="i in count" :key="i">
              <button @click="threeStore.addObject(new OBJObject(`${type}/${PluralToSingular[type]}-${i}`))">
                Add {{ PluralToSingular[type] }} {{ i }}
              </button>
            </li>
            <!-- <li>
              <button @click="threeStore.addObject(new OBJObject('wheel-2'))">Add wheel 2</button>
            </li> -->
          </ul>
        </div>
      </div>
    </div>

    <button @click="store.toggleMenu()" class="w-8 h-8 text-zinc-400 hover:text-zinc-600">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </button>
  </div>
</template>
