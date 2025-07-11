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
          <div class="input-container">
            <input
              type="text"
              v-model="formData.name"
              class="form-input"
              :class="{ 'input-error': nameCheckMessage && !isNameChecked }"
              :placeholder="t('instance.detail.editBasicInfo.name.placeholder')"
            />
            <!-- 중복 확인 버튼 -->
            <button
              class="check-button"
              :class="{
                checking: isCheckingDuplicate,
                checked: isNameChecked && !isDuplicate,
                error: isDuplicate,
              }"
              @click="checkDuplicateName"
              :disabled="isCheckingDuplicate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 6-6" />
              </svg>
            </button>
          </div>
          <span
            v-if="nameCheckMessage"
            class="validation-message"
            :class="{ 'error-message': !isNameChecked || isDuplicate }"
          >
            {{ nameCheckMessage }}
          </span>
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
import { useInstancesStore } from '@/stores/instances'
import { useLoadingStore } from '@/stores/loading'
import { delay } from '@/mock/utils/delay'

const { t } = useI18n()
const instanceStore = useInstancesStore()
const loadingStore = useLoadingStore()

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

// 중복 체크 관련 상태
const isCheckingDuplicate = ref(false)
const isDuplicate = ref(false)
const isNameChecked = ref(false)
const nameCheckMessage = ref('')

// 이름이 변경되면 중복 체크 상태 초기화
const resetDuplicateCheck = () => {
  if (!isCheckingDuplicate.value) {
    isDuplicate.value = false
    isNameChecked.value = false
    nameCheckMessage.value = t('instance.create.validation.name_duplicate.required')
  }
}

// 이름이 변경되면 중복 체크 상태 초기화
watch(
  () => formData.value.name,
  () => {
    if (formData.value.name !== props.instance.name) {
      resetDuplicateCheck()
    } else {
      nameCheckMessage.value = ''
    }
  }
)

// 중복 체크 함수
const checkDuplicateName = async () => {
  if (!formData.value.name) {
    nameCheckMessage.value = t('instance.create.validation.name')
    return
  }

  isCheckingDuplicate.value = true
  isNameChecked.value = false
  isDuplicate.value = false
  nameCheckMessage.value = t('instance.create.validation.name_duplicate.checking')

  try {
    await delay(500) // API 호출을 시뮬레이션하기 위한 지연
    const trimmedName = formData.value.name.trim().toLowerCase()

    // 현재 편집 중인 인스턴스의 원래 이름과 같으면 중복 아님
    if (trimmedName === props.instance.name.trim().toLowerCase()) {
      isDuplicate.value = false
    } else {
      // 다른 이름으로 변경하는 경우에만 중복 체크
      isDuplicate.value = instanceStore.instances.some(
        (instance: Instance) => instance.name.trim().toLowerCase() === trimmedName
      )
    }

    isNameChecked.value = true
    nameCheckMessage.value = isDuplicate.value
      ? t('instance.create.validation.name_duplicate.duplicate')
      : t('instance.create.validation.name_duplicate.available')
  } catch (error) {
    console.error('중복 체크 중 오류:', error)
    nameCheckMessage.value = t('instance.create.validation.name_duplicate.error')
  } finally {
    isCheckingDuplicate.value = false
  }
}

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

const handleSave = async () => {
  // 이름이 변경되었고 중복 체크가 되지 않았다면 저장 불가
  if (formData.value.name !== props.instance.name && !isNameChecked.value) {
    nameCheckMessage.value = t('instance.create.validation.name_duplicate.required')
    return
  }

  // 중복된 이름이면 저장 불가
  if (isDuplicate.value) {
    return
  }

  // 저장할 데이터를 미리 준비
  const dataToSave = { ...formData.value }

  // 모달 먼저 닫기
  emit('close')

  try {
    await loadingStore.withLoading(
      async () => {
        emit('save', dataToSave)
      },
      500, // 최소 0.5초
      2000 // 최대 2초
    )
  } catch (error) {
    console.error('저장 중 오류 발생:', error)
  }
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

.input-container {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #595959;
  height: 40px;
  padding-right: 40px;
}

.form-input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.check-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  width: 20px;
  height: 20px;
}

.check-button:hover {
  color: #1890ff;
}

.check-button:disabled:hover {
  color: #8c8c8c;
}

.check-button.checking {
  animation: rotate 1s linear infinite;
}

.check-button.checked {
  color: #52c41a;
}

.check-button.error {
  color: #ff4d4f;
}

.check-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@keyframes rotate {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

.validation-message {
  font-size: 12px;
  margin-top: 4px;
  display: block;
  color: #52c41a;
}

.error-message {
  color: #ff4d4f;
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
  margin-right: 8px;
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

.input-error {
  border-color: #ff4d4f !important;
}

.input-error:focus {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
}
</style>
