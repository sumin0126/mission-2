<template>
  <div
    class="preview-box"
    :class="{
      'preview-box-valid': isValid,
      'preview-box-invalid': showInvalid,
    }"
  >
    <h3>선택된 사양 미리보기</h3>
    <div class="preview-content">
      <div class="preview-item">
        <span class="label">이름</span>
        <span class="value">{{ instance.name || '-' }}</span>
      </div>
      <div class="preview-item">
        <span class="label">이미지</span>
        <span class="value">{{ instance.image || '-' }}</span>
      </div>
      <div class="preview-item">
        <span class="label">CPU</span>
        <span class="value">{{ instance.cpu || '-' }}</span>
      </div>
      <div class="preview-item">
        <span class="label">메모리</span>
        <span class="value">{{ instance.memory ? instance.memory + 'GB' : '-' }}</span>
      </div>
      <div class="preview-item">
        <span class="label">디스크</span>
        <span class="value">{{ instance.disk ? instance.disk + 'GB' : '-' }}</span>
      </div>
      <div class="preview-item">
        <span class="label">네트워크</span>
        <span class="value">{{ instance.network || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Instance {
  name: string
  image: string
  cpu: number
  memory: number
  disk: number
  network: string
}

defineProps<{
  instance: Instance
  isValid: boolean
  showInvalid: boolean
}>()
</script>

<style scoped>
.preview-box {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.3s ease;
}

.preview-box-valid {
  background-color: rgba(2, 103, 255, 0.05);
  border-color: #1890ff;
}

.preview-box-invalid {
  background-color: rgba(255, 77, 79, 0.05);
  border-color: #ff4d4f;
}

.preview-box h3 {
  margin: 0 0 20px 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.preview-item .label {
  color: #8c8c8c;
}

.preview-item .value {
  color: #262626;
  font-weight: 400;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .preview-box {
    padding: 12px;
  }

  .preview-box h3 {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .preview-content {
    gap: 12px;
  }

  .preview-item {
    font-size: 13px;
  }
}

@media (max-width: 1024px) {
  .preview-box {
    padding: 16px;
  }
}
</style>
