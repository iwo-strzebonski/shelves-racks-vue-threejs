<script setup lang="ts">
import store from '../stores/three.store'
</script>

<template>
  <nav class="inline-flex m-2 p-2 gap-2 bg-zinc-500 text-zinc-200 rounded-md">
    <div class="inline-flex pl-2 gap-2 border-l-2 border-solid border-zinc-400 first:border-none first:pl-0">
      <button
        @click="store.resetCamera()"
        v-tooltip="'Reset Camera'"
        class="w-8 h-8 rounded-md hover:bg-white/25"
        type="button"
        title="Reset Camera"
      >
        <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
      </button>
    </div>
    <div class="inline-flex pl-2 gap-2 border-l-2 border-solid border-zinc-400 first:border-none first:pl-0">
      <button
        @click="store.changeTransformControls('translate')"
        v-tooltip="'Orbit'"
        v-bind:disabled="store.transformControls === 'translate'"
        v-bind:class="store.transformControls === 'translate' ? 'text-zinc-700 bg-zinc-200' : 'hover:bg-white/25'"
        class="w-8 h-8 rounded-md"
        type="button"
        title="Translate Object"
      >
        <font-awesome-icon icon="fa-solid fa-up-down-left-right" />
      </button>
      <button
        @click="store.changeTransformControls('rotate')"
        v-tooltip="'Pan'"
        v-bind:disabled="store.transformControls === 'rotate'"
        v-bind:class="store.transformControls === 'rotate' ? 'text-zinc-700 bg-zinc-200' : 'hover:bg-white/25'"
        class="w-8 h-8 rounded-md"
        type="button"
        title="Rotate Object"
      >
        <font-awesome-icon icon="fa-solid fa-rotate-right" />
      </button>
    </div>
    <div class="inline-flex pl-2 gap-2 border-l-2 border-solid border-zinc-400 first:border-none first:pl-0">
      <button
        @click="store.changeViewMode(store.viewMode === 'perspective' ? 'orthographic' : 'perspective')"
        v-tooltip="'Change camera mode'"
        class="w-8 h-8 rounded-md hover:bg-white/25"
        type="button"
        title="Camera Mode"
      >
        <font-awesome-icon
          v-bind:icon="(store.viewMode === 'perspective' ? 'fa-vector-square' : 'fa-cube') + ' fa-solid'"
        />
      </button>
    </div>
    <div class="inline-flex pl-2 gap-2 border-l-2 border-solid border-zinc-400 first:border-none first:pl-0">
      <button
        @click="store.toggleGrid()"
        v-tooltip="'Toggle grid'"
        v-bind:class="store.showGrid ? 'text-zinc-700 bg-zinc-200' : 'hover:bg-white/25'"
        class="w-8 h-8 rounded-md"
        type="button"
        title="Toggle grid"
      >
        <font-awesome-icon v-bind:icon="(store.showGrid ? 'fa-border-all' : 'fa-border-none') + ' fa-solid'" />
      </button>
    </div>
    <div class="inline-flex pl-2 gap-2 border-l-2 border-solid border-zinc-400 first:border-none first:pl-0">
      <button
        @click="store.changeControlsMode('orbit')"
        v-tooltip="'Orbit'"
        v-bind:disabled="store.controlsMode === 'orbit'"
        v-bind:class="store.controlsMode === 'orbit' ? 'text-zinc-700 bg-zinc-200' : 'hover:bg-white/25'"
        class="w-8 h-8 rounded-md"
        type="button"
        title="Orbit"
      >
        <font-awesome-icon icon="fa-solid fa-camera-rotate" />
      </button>
      <button
        @click="store.changeControlsMode('pan')"
        v-tooltip="'Pan'"
        v-bind:disabled="store.controlsMode === 'pan'"
        v-bind:class="store.controlsMode === 'pan' ? 'text-zinc-700 bg-zinc-200' : 'hover:bg-white/25'"
        class="w-8 h-8 rounded-md"
        type="button"
        title="Pan"
      >
        <font-awesome-icon icon="fa-solid fa-up-down-left-right" />
      </button>
    </div>
  </nav>
</template>
