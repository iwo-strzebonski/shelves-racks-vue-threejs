<script setup lang="ts">
import store from '../stores/asset.store'
</script>

<template>
  <div
    class="absolute left-0 top-20 inline-flex h-[calc(100vh_-_80px)] transition-all ease-in-out duration-500 motion-reduce:transition-none"
    v-bind:class="store.isMenuOpen ? 'w-[calc(25%_+_32px)]' : 'w-8 delay-50'"
  >
    <div class="transition-all w-[calc(100%_-_32px)] h-full bg-zinc-300">
      <div class="flex flex-col p-4" v-bind:class="store.isMenuOpen ? 'delay-200' : 'collapse'">
        <h2 class="self-center">Assets menu</h2>
      </div>
    </div>

    <button @click="store.toggleMenu()" class="w-8 h-8 text-zinc-400 hover:text-zinc-600">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </button>
  </div>
</template>
