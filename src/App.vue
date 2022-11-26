<script setup lang="ts">
import AppHeader from './components/appHeader.component.vue'
import assetsMenu from './components/assetsMenu.vue'
</script>

<template>
  <div class="h-screen w-screen bg-zinc-100">
    <app-header />
    <assets-menu />

    <main>
      <div id="scene-container" class="h-screen w-screen"></div>
    </main>
  </div>
</template>
