<template>
  <div>
    <label class="power-switch">
      <input
        type="checkbox"
        :checked="isRunning"
        @click.prevent="handleClick"
        :disabled="disabled"
      />
      <span class="slider"></span>
    </label>

    <!-- 전원 끄기 경고 모달 -->
    <PowerOffWarningModal
      v-model="showWarningModal"
      :title="t('common.modal.notification')"
      :main-message="t('instance.power.shutdown.message')"
      :warning-message="t('instance.power.shutdown.warning')"
      :confirm-text="t('instance.power.shutdown.confirm')"
      :cancel-text="t('common.button.cancel')"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PowerOffWarningModal from '@/components/common/PowerOffWarningModal.vue'

const { t } = useI18n()

const props = defineProps<{
  isRunning: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const showWarningModal = ref(false)

const handleClick = () => {
  // 전원을 켤 때는 바로 실행
  if (!props.isRunning) {
    emit('toggle')
    return
  }

  // 전원을 끄려고 할 때는 확인 모달 표시
  showWarningModal.value = true
}

const handleConfirm = () => {
  emit('toggle')
  showWarningModal.value = false
}
</script>

<style scoped>
.power-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.power-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #1890ff;
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider:hover {
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}
</style>
