<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<template>
  <LoadingSpinner :is-visible="loadingStore.isLoading" />
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
