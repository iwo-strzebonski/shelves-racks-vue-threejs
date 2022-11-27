<script setup lang="ts">
import CameraControls from './cameraControls.component.vue'
</script>

<template>
  <header class="absolute inline-flex justify-between w-screen h-20 bg-zinc-900 py-2 px-4">
    <h1 class="text-zinc-400 self-center text-2xl font-semibold">Rack creator by Octoturge</h1>

    <camera-controls />
  </header>
</template>
