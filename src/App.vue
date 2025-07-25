<!-- 루트 컴포넌트 -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppBreadcrumb from '@/components/common/AppBreadcrumb.vue'
import AppLoadingSpinner from '@/components/common/AppLoadingSpinner.vue'
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<template>
  <!-- 로딩 스피너 -->
  <AppLoadingSpinner :is-visible="loadingStore.isLoading" />
  <!-- 헤더 -->
  <AppHeader />
  <!-- 브레드크럼브 -->
  <AppBreadcrumb />
  <!-- 메인 콘텐츠 -->
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
