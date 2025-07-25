<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-button" @click="handleClose">
            <span class="close-icon">×</span>
          </button>
        </div>
        <div class="modal-content">
          <p class="message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <div class="checkbox-wrapper" v-if="showDontShowOption">
            <label class="checkbox-label">
              <input type="checkbox" v-model="dontShowToday" class="checkbox-input" />
              <span class="checkbox-text">{{ t('common.modal.dontShowToday') }}</span>
            </label>
          </div>
          <div class="button-wrapper">
            <button class="btn btn-confirm" @click="handleConfirm">
              {{ confirmText || t('common.button.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  modelValue: boolean // 모달 열림, 닫힘 상태
  title: string // 모달 제목
  message: string // 알림 메시지
  confirmText?: string // 확인 버튼 텍스트 (기본값: '확인')
  showDontShowOption?: boolean // 오늘 하루 보지 않기 옵션 표시 여부
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void // 모달 상태 업데이트
  (e: 'confirm', dontShowToday: boolean): void // 확인 버튼 클릭 시 체크박스 상태 전달
}>()

// "오늘 하루동안 보지 않기" 상태
const dontShowToday = ref(false)

// 확인 버튼 클릭 핸들러
const handleConfirm = () => {
  emit('confirm', dontShowToday.value)
  emit('update:modelValue', false)
}

// 닫기 버튼 클릭 핸들러
const handleClose = () => {
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
}

.modal-content {
  padding: 24px;
  font-size: 14px;
  color: #262626;
}

.message {
  margin: 0;
}

.modal-footer {
  padding: 10px 24px;
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 14px;
  height: 14px;
  margin: 0;
  cursor: pointer;
  opacity: 0.7;
}

.checkbox-text {
  font-size: 14px;
  color: #7e7e7e;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background: #1890ff;
  border: 1px solid #1890ff;
  color: white;
}

.btn-confirm:hover {
  background: #40a9ff;
  border-color: #40a9ff;
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

  .checkbox-text {
    font-size: 13px;
  }
}
</style>
