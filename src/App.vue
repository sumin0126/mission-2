<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
</script>

<template>
  <div id="app">
    <AppHeader />
    <AppBreadcrumb />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
