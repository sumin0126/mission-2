<template>
  <span
    class="status-tag"
    :class="{
      'status-running': status === 'RUNNING',
      'status-shutdown': status === 'SHUTDOWN',
    }"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()
</script>

<style scoped>
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-running {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-shutdown {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
</style>
