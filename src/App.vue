<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import AppLoadingSpinner from '@/components/common/AppLoadingSpinner.vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<template>
  <AppLoadingSpinner :is-visible="loadingStore.isLoading" />
  <AppHeader />
  <AppBreadcrumb />
  <main class="main-content">
    <RouterView />
  </main>
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
