<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>
            <span class="warning-icon-wrapper">
              <svg
                class="warning-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8.5V13.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M12 16.5V16.6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </span>
            {{ title }}
          </h3>
          <button class="close-button" @click="handleCancel">
            <span class="close-icon">×</span>
          </button>
        </div>
        <div class="modal-content">
          <p class="main-message">{{ mainMessage }}</p>
          <p class="warning-message">{{ warningMessage }}</p>
        </div>
        <div class="modal-footer">
          <div class="button-wrapper">
            <button class="btn btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="btn btn-danger" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  modelValue: boolean
  title?: string
  mainMessage?: string
  warningMessage?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void // 모달 열림/닫힘 상태
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// 종료 버튼 클릭시
const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

// 취소 버튼 클릭시
const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  width: 460px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.warning-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #fff2f0;
  border-radius: 50%;
}

.warning-icon {
  width: 16px;
  height: 16px;
  color: #ff4d4f;
}

.modal-content {
  padding: 24px;
  font-size: 14px;
  color: #262626;
}

.main-message {
  margin: 0 0 8px 0;
  color: #262626;
}

.warning-message {
  margin: 0;
  color: #ff4d4f;
}

.modal-footer {
  padding: 10px 24px;
  padding-bottom: 24px;
  display: flex;
  justify-content: flex-end;
}

.button-wrapper {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #d9d9d9;
  color: #262626;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-danger {
  background: #ff4d4f;
  border: 1px solid #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background: #ff7875;
  border-color: #ff7875;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #8c8c8c;
  font-size: 20px;
  line-height: 1;
  transition: color 0.2s;
}

.close-button:hover {
  color: #262626;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .modal-container {
    width: 90%;
    max-width: 400px;
    margin: 0 16px;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-header h3 {
    font-size: 15px;
  }

  .modal-content {
    padding: 16px;
    font-size: 13px;
  }

  .modal-footer {
    padding: 10px 16px;
    padding-bottom: 20px;
  }

  .btn {
    padding: 6px 16px;
    font-size: 13px;
  }
}
</style>
