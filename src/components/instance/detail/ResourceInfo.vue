<template>
  <div class="section-box">
    <div class="section-header">
      <h3>리소스 정보</h3>
      <button class="btn-edit">
        <span class="edit-icon">✎</span>
      </button>
    </div>
    <div class="section-content">
      <div class="info-row">
        <span class="label">CPU</span>
        <span class="value">{{ instance?.cpu || '-' }}코어</span>
      </div>
      <div class="info-row">
        <span class="label">메모리</span>
        <span class="value">{{ instance?.memory || '-' }}GB</span>
      </div>
      <div class="info-row">
        <span class="label">디스크</span>
        <span class="value">{{ instance?.disk || '-' }}GB</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Instance } from '@/mock/types/instance'

defineProps<{
  instance: Instance | null
}>()
</script>

<style scoped>
.section-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #ffffff;
}

.section-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.btn-edit {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #8c8c8c;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.edit-icon {
  font-size: 16px;
}

.section-content {
  padding: 24px;
}

.info-row {
  display: flex;
  margin-bottom: 24px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 150px;
  color: #262626;
  font-size: 14px;
}

.info-row .value {
  flex: 1;
  color: #787878;
  font-size: 14px;
}
</style>
