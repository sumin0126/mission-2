<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ t('instance.detail.editBasicInfo.title') }}</h3>
        <button class="close-button" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>{{ t('instance.detail.editBasicInfo.name.label') }}</label>
          <input
            type="text"
            v-model="formData.name"
            class="form-input"
            :placeholder="t('instance.detail.editBasicInfo.name.placeholder')"
          />
        </div>
        <div class="form-group">
          <label>{{ t('instance.detail.editBasicInfo.power.label') }}</label>
          <div class="select-container" ref="selectContainer">
            <div
              class="select-box"
              :class="{ active: isDropdownOpen }"
              @click="toggleDropdown"
              tabindex="0"
            >
              <span>{{ t(`instance.detail.editBasicInfo.power.${formData.power}`) }}</span>
              <span class="arrow-down"></span>
            </div>
            <div class="dropdown-list" :class="{ 'dropdown-open': isDropdownOpen }">
              <div
                v-for="option in ['on', 'off']"
                :key="option"
                class="dropdown-item"
                :class="{ selected: option === formData.power }"
                @click="selectPowerOption(option)"
              >
                {{ t(`instance.detail.editBasicInfo.power.${option}`) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">
          {{ t('instance.detail.editBasicInfo.button.cancel') }}
        </button>
        <button class="btn btn-save" @click="handleSave">
          {{ t('instance.detail.editBasicInfo.button.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Instance } from '@/mock/types/instance'

const { t } = useI18n()
const props = defineProps<{
  isOpen: boolean
  instance: Instance
}>()

// BasicInfo한테 보낼 이벤트 정의
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: { name: string; power: string }): void
}>()

const formData = ref({
  name: props.instance.name,
  power: props.instance.status === 'RUNNING' ? 'on' : 'off',
})

// 모달이 열릴 때마다 최신 instance 데이터로 formData 초기화
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      formData.value = {
        name: props.instance.name,
        power: props.instance.status === 'RUNNING' ? 'on' : 'off',
      }
    }
  }
)

// instance 데이터가 변경될 때도 formData 업데이트
watch(
  () => props.instance,
  (newInstance) => {
    formData.value = {
      name: newInstance.name,
      power: newInstance.status === 'RUNNING' ? 'on' : 'off',
    }
  },
  { deep: true }
)

const isDropdownOpen = ref(false)
const selectContainer = ref<HTMLElement | null>(null)

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  emit('save', formData.value)
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectPowerOption = (option: string) => {
  formData.value.power = option
  isDropdownOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  color: #262626;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #8c8c8c;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #262626;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #595959;
  height: 40px;
}

.form-input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.select-container {
  position: relative;
  width: 100%;
}

.select-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  height: 40px;
  font-size: 14px;
  color: #595959;
}

.select-box:hover {
  border-color: #40a9ff;
}

.select-box.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.arrow-down {
  border: solid #8c8c8c;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 8px;
  transition: transform 0.2s;
}

.select-box.active .arrow-down {
  transform: rotate(-135deg);
}

.dropdown-list {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.dropdown-list.dropdown-open {
  max-height: 300px;
  opacity: 1;
}

.dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #595959;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.selected {
  background-color: #e6f7ff;
  color: #262626;
}

.modal-footer {
  padding: 10px 24px;
  padding-bottom: 30px;
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

.btn-cancel {
  background: white;
  border: 1px solid #d9d9d9;
  color: #262626;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background: #1890ff;
  border: 1px solid #1890ff;
  color: white;
}

.btn-save:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .modal-content {
    margin: 0 16px;
  }

  .modal-body {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .select-box {
    height: 36px;
    font-size: 13px;
  }

  .dropdown-item {
    padding: 8px 12px;
    font-size: 13px;
  }
  .form-input {
    height: 36px;
    font-size: 13px;
  }
}
</style>
