<template>
  <div class="instance-create">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="page-title">
        <h2>{{ t('instance.title') }}</h2>
        <p>{{ t('instance.create.description') }}</p>
      </div>
    </div>

    <!-- 생성 폼 -->
    <div class="create-form-container">
      <div class="form-section">
        <!-- 인스턴스 이름 입력 -->
        <div class="form-group">
          <label>{{ t('instance.create.form.name.label') }}<span class="required">*</span></label>
          <div class="name-input-group">
            <input
              ref="nameInput"
              type="text"
              v-model="formData.name"
              :placeholder="t('instance.create.form.name.placeholder')"
              class="form-input"
              :class="{ 'input-error': errors.name || isDuplicate }"
              @keydown.enter="handleEnter('name')"
              @blur="handleBlur('name')"
              @input="handleNameInput"
            />
            <!-- 중복 확인 버튼 -->
            <button
              class="btn btn-check"
              :disabled="!isDuplicateCheckEnabled || isCheckingDuplicate"
              @click="checkDuplicateName"
            >
              {{
                isCheckingDuplicate
                  ? t('instance.create.button.checking')
                  : t('instance.create.button.duplicateCheck')
              }}
            </button>
          </div>
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          <!-- 이름이 중복되었을때 에러 메시지 -->
          <span v-else-if="isDuplicate" class="error-text">{{
            t('instance.create.validation.name_duplicate.duplicate')
          }}</span>
          <!-- 이름이 중복되지 않았을때 성공 메시지 -->
          <span v-else-if="isNameChecked && !isDuplicate" class="success-text">{{
            t('instance.create.validation.name_duplicate.available')
          }}</span>
        </div>

        <!-- 이미지 선택 -->
        <div class="form-group">
          <label>{{ t('instance.create.form.image.label') }}<span class="required">*</span></label>
          <ImageSelect
            ref="imageSelect"
            v-model="formData.image"
            :class="{ 'input-error': errors.image }"
            @keydown:enter="handleEnter('image')"
            @blur="validateField('image')"
            @update:modelValue="validateField('image')"
          />
          <span v-if="errors.image" class="error-text">{{ errors.image }}</span>
        </div>

        <!-- Flavor 선택 -->
        <div class="form-group">
          <label>{{ t('instance.create.form.flavor.label') }}<span class="required">*</span></label>
          <FlavorSelect
            ref="flavorSelect"
            v-model="formData.flavor"
            :class="{ 'input-error': errors.flavor }"
            @update:flavor-detail="updateFlavorDetail"
            @keydown:enter="handleEnter('flavor')"
            @blur="validateField('flavor')"
            @update:modelValue="validateField('flavor')"
          />
          <span v-if="errors.flavor" class="error-text">{{ errors.flavor }}</span>
        </div>

        <!-- 네트워크 선택 -->
        <div class="form-group">
          <label
            >{{ t('instance.create.form.network.label') }}<span class="required">*</span></label
          >
          <NetworkSelect
            ref="networkSelect"
            v-model="formData.network"
            :class="{ 'input-error': errors.network }"
            @keydown:enter="handleEnter('network')"
            @blur="validateField('network')"
            @update:modelValue="validateField('network')"
          />
          <span v-if="errors.network" class="error-text">{{ errors.network }}</span>
        </div>
      </div>

      <!-- 선택된 사양 미리보기 -->
      <div class="preview-section">
        <InstancePreview
          :instance="{
            name: formData.name,
            image: formData.image,
            cpu: formData.flavorDetail.cpu,
            memory: formData.flavorDetail.memory,
            disk: formData.flavorDetail.disk,
            network: formData.network,
          }"
          :is-valid="isFormValid"
          :show-invalid="showInvalidPreview"
        />
      </div>
    </div>

    <!-- 하단 버튼 영역 -->
    <div class="action-buttons">
      <button class="btn btn-cancel" @click="handleCancel">{{ t('common.button.cancel') }}</button>
      <button class="btn btn-create" :disabled="instanceStore.isLoading" @click="handleCreate">
        {{
          instanceStore.isLoading ? t('instance.create.button.creating') : t('common.button.create')
        }}
      </button>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="instanceStore.error" class="error-message">
      {{ instanceStore.error }}
    </div>

    <!-- 인스턴스 생성 성공 모달 -->
    <AppAlertModal
      v-model="showSuccessModal"
      :title="t('common.modal.notification')"
      :message="t('instance.create.success.message')"
      :confirm-text="t('common.button.confirm')"
      :show-dont-show-option="true"
      @confirm="handleSuccessConfirm"
    />

    <!-- 에러 모달 -->
    <AppAlertModal
      v-model="showErrorModal"
      :title="t('common.modal.error')"
      :message="errorMessage"
      @confirm="handleErrorModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useInstancesStore } from '@/stores/instances'
import { useLoadingStore } from '@/stores/loading'

import type { Flavor } from '@/mock/types/flavor'
import type { Instance } from '@/mock/types/instance'

import FlavorSelect from '@/components/instance/create/FlavorSelect.vue'
import ImageSelect from '@/components/instance/create/ImageSelect.vue'
import NetworkSelect from '@/components/instance/create/NetworkSelect.vue'
import InstancePreview from '@/components/InstancePreview.vue'
import AppAlertModal from '@/components/common/AppAlertModal.vue'

// FormField: 인스턴스 생성에 필요한 필수 입력 필드들의 유니온 타입
type FormField = 'name' | 'image' | 'flavor' | 'network'
// FormErrors: 각 필드별 유효성 검사 에러 메시지를 저장하는 타입
type FormErrors = Record<FormField, string>
// FormData: 인스턴스 생성 폼의 전체 데이터 구조를 정의하는 타입
type FormData = {
  name: string
  image: string
  flavor: string
  network: string
  flavorDetail: Flavor
}

// Vue Router, Store, i18n 초기화
const router = useRouter()
const instanceStore = useInstancesStore()
const loadingStore = useLoadingStore()
const { t } = useI18n()

// 각 필드별 유효성 검사 메시지 정의
const VALIDATION_MESSAGES = {
  name: t('instance.create.validation.name'),
  image: t('instance.create.validation.image'),
  flavor: t('instance.create.validation.flavor'),
  network: t('instance.create.validation.network'),
} as const

// 인스턴스 이름 유효성 검사 규칙 정의
const NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 30,
  PATTERN: /^[a-zA-Z0-9-_.]+$/,
} as const

// Flavor 초기 상태 정의
const INITIAL_FLAVOR: Flavor = {
  name: '',
  description: '',
  cpu: 0,
  memory: 0,
  disk: 0,
}

// 폼 필드 refs 정의
const nameInput = ref<HTMLInputElement | null>(null)
const imageSelect = ref<InstanceType<typeof ImageSelect> | null>(null)
const flavorSelect = ref<InstanceType<typeof FlavorSelect> | null>(null)
const networkSelect = ref<InstanceType<typeof NetworkSelect> | null>(null)

// 폼 데이터 초기화
const formData = ref<FormData>({
  name: '',
  image: '',
  flavor: '',
  network: '',
  flavorDetail: { ...INITIAL_FLAVOR },
})

// 에러 상태 초기화
const errors = ref<FormErrors>({
  name: '',
  image: '',
  flavor: '',
  network: '',
})

// 중복 체크 관련 상태 초기화
const isCheckingDuplicate = ref(false) // 중복 체크가 진행중인지
const isDuplicate = ref(false) // 중복되는지
const isNameChecked = ref(false) // 중복 체크가 완료되었는지

// UI 상태 초기화
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const showInvalidPreview = ref(false) // 미리보기 박스가 유효하지 않은 상태일떄, 박스에 에러 스타일 적용

// 폼 유효성 검사 computed 속성
const isFormValid = computed(() => {
  return (
    // 모든 에러 메시지가 비어있는지 확인
    Object.values(errors.value).every((error) => error === '') &&
    // formData 값이 있는지 확인
    Object.values(formData.value).every((value) => value !== '')
  )
})

// 중복 확인 버튼 활성화 여부 computed 속성
const isDuplicateCheckEnabled = computed(() => {
  const nameLength = formData.value.name.trim().length
  return (
    nameLength >= NAME_VALIDATION.MIN_LENGTH &&
    nameLength <= NAME_VALIDATION.MAX_LENGTH &&
    !formData.value.name.includes(' ') &&
    NAME_VALIDATION.PATTERN.test(formData.value.name)
  )
})

// 이름 유효성 검사 결과 타입 정의
interface NameValidityResult {
  valid: boolean
  error: string
}

// 이름 필드 유효성 검사 함수
const checkNameValidity = (trimmedName: string): NameValidityResult => {
  // 이름이 없을 경우
  if (!trimmedName) {
    return {
      valid: false,
      error: t('instance.create.validation.name'),
    }
  }

  // 2자 이하일 경우
  if (trimmedName.length < NAME_VALIDATION.MIN_LENGTH) {
    return {
      valid: false,
      error: t('instance.create.validation.name_length.min', { min: NAME_VALIDATION.MIN_LENGTH }),
    }
  }

  // 30자 이상일 경우
  if (trimmedName.length > NAME_VALIDATION.MAX_LENGTH) {
    return {
      valid: false,
      error: t('instance.create.validation.name_length.max', { max: NAME_VALIDATION.MAX_LENGTH }),
    }
  }

  // 정규표현식에 포함되지 않는 문자를 사용한 경우
  if (NAME_VALIDATION.PATTERN.test(trimmedName) === false) {
    return {
      valid: false,
      error: t('instance.create.validation.name_pattern.invalid_chars'),
    }
  }

  // 중복 확인이 완료되지 않은 경우
  if (!isNameChecked.value) {
    return {
      valid: false,
      error: t('instance.create.validation.name_duplicate.required'),
    }
  }

  // 유효한 경우
  return {
    valid: true,
    error: '',
  }
}

// 필드 유효성 검사 함수
const validateField = (field: FormField): boolean => {
  showInvalidPreview.value = false
  const value = field === 'name' ? formData.value[field].trim() : formData.value[field]

  if (field === 'name') {
    const validation = checkNameValidity(value)
    errors.value[field] = validation.error
    return validation.valid
  } else {
    errors.value[field] = value === '' ? VALIDATION_MESSAGES[field] : ''
    return errors.value[field] === ''
  }
}

// 전체 폼 유효성 검사 함수
const validateForm = () => {
  const fields: FormField[] = ['name', 'image', 'flavor', 'network']
  const isValid = fields.every((field) => validateField(field))
  if (isValid) {
    showInvalidPreview.value = false
  }
  return isValid
}

// 중복 이름 체크 함수
const checkDuplicateName = async () => {
  const trimmedName = formData.value.name.trim()
  if (!trimmedName) return

  isCheckingDuplicate.value = true
  isDuplicate.value = false
  isNameChecked.value = false
  errors.value.name = ''

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    isDuplicate.value = instanceStore.instances.some(
      (instance: Instance) => instance.name.toLowerCase() === trimmedName.toLowerCase()
    )
    isNameChecked.value = true

    if (isDuplicate.value) {
      errors.value.name = t('instance.create.validation.name_duplicate.duplicate')
    }
  } catch (error) {
    console.error(t('instance.detail.error.updateLog'), error)
    errors.value.name = t('instance.create.validation.name_duplicate.error')
  } finally {
    isCheckingDuplicate.value = false
  }
}

// 인스턴스 생성 처리 함수
const handleCreate = async () => {
  if (!validateForm()) {
    // 폼이 유효하지 않은 상태에서 생성 버튼 클릭 시, 사양 미리보기 박스 true
    showInvalidPreview.value = true
    return
  }

  // 중복 체크 검증
  if (!isNameChecked.value) {
    errors.value.name = t('instance.create.validation.name_duplicate.required')
    return
  }
  if (isDuplicate.value) {
    errors.value.name = t('instance.create.validation.name_duplicate.duplicate')
    return
  }

  try {
    // 인스턴스 생성
    await loadingStore.withLoading(async () => {
      const result = await instanceStore.createInstance({
        name: formData.value.name,
        flavor: formData.value.flavor,
        image: formData.value.image,
        network: formData.value.network,
        cpu: formData.value.flavorDetail.cpu,
        memory: formData.value.flavorDetail.memory,
        disk: formData.value.flavorDetail.disk,
        status: 'RUNNING',
        powerOn: true,
        createdAt: new Date().toISOString(),
      })

      try {
        // 인스턴스 목록 새로고침 시도
        await instanceStore.getInstances()
      } catch (refreshError) {
        // 목록 새로고침 실패 시 경고 처리
        console.error(t('instance.detail.error.refreshList'), refreshError)
        errorMessage.value = t('instance.detail.error.refreshListWarning')
        showErrorModal.value = true
        return result
      }

      return result
    })

    // 성공 모달 표시 여부 결정
    const dontShowDate = localStorage.getItem('dontShowCreateSuccess')
    const today = new Date().toDateString()

    if (dontShowDate === today) {
      router.push({ name: 'instanceList' })
    } else {
      showSuccessModal.value = true
    }
  } catch (error) {
    // 인스턴스 생성 실패 시 에러 처리
    errorMessage.value = t('instance.detail.error.create')
    showErrorModal.value = true
    console.error(t('instance.detail.error.createLog'), error)
  }
}

// 성공 모달 확인 처리 함수
const handleSuccessConfirm = (dontShowToday: boolean) => {
  if (dontShowToday) {
    localStorage.setItem('dontShowCreateSuccess', new Date().toDateString())
  }
  router.push({ name: 'instanceList' })
}

// 에러 모달 닫기 함수
const handleErrorModalClose = () => {
  showErrorModal.value = false
}

// 취소 버튼 처리 함수
const handleCancel = () => {
  router.push({ name: 'instanceList' })
}

// 중복 체크 상태 초기화 함수
const resetDuplicateCheck = () => {
  if (!isCheckingDuplicate.value) {
    isDuplicate.value = false
    isNameChecked.value = false
  }
}

// 이름 입력 처리 함수
const handleNameInput = () => {
  const currentValue = formData.value.name

  // 공백 입력 검사
  if (currentValue.includes(' ')) {
    errors.value.name = t('instance.create.validation.name_pattern.no_spaces')
    return
  }

  resetDuplicateCheck()
  validateField('name')
}

// 필드 blur 이벤트 처리 함수 (사용자가 필드를 떠날 때 -> 해당 필드 유효성 검사)
const handleBlur = (field: FormField) => {
  validateField(field)
}

// Flavor 상세 정보 업데이트 함수
const updateFlavorDetail = (flavor: Flavor) => {
  formData.value.flavorDetail = flavor
}

// Enter 키 처리 함수
const handleEnter = (currentField: FormField) => {
  if (!validateField(currentField)) return

  // 필드 순서 정의
  const fieldOrder: FormField[] = ['name', 'image', 'flavor', 'network']
  const currentIndex = fieldOrder.indexOf(currentField)
  const nextField = fieldOrder[currentIndex + 1]

  // 마지막 필드인 경우 전체 폼 유효성 검사 후, 생성 처리
  if (!nextField) {
    if (validateForm()) {
      handleCreate()
    }
    return
  }

  // 다음 필드로 포커스 이동
  if (nextField === 'name') {
    nameInput.value?.focus()
  } else {
    const component = {
      image: imageSelect,
      flavor: flavorSelect,
      network: networkSelect,
    }[nextField]
    component.value?.$el.querySelector('.select-box')?.focus()
  }
}
</script>

<style scoped>
.instance-create {
  padding: 24px;
  background-color: #ffffff;
  min-height: calc(100vh - 48px);
}

.action-bar {
  margin-bottom: 32px;
}

.page-title h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.page-title p {
  margin: 0;
  font-size: 14px;
  color: #8c8c8c;
}

.create-form-container {
  display: flex;
  gap: 32px;
  justify-content: space-between;
  max-width: 100%;
}

.form-section {
  flex: 1;
  max-width: 800px;
  min-width: 0;
}

.preview-section {
  width: 360px;
  flex-shrink: 0;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
  font-size: 14px;
}

.required {
  color: #ff4d4f;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #262626;
  background-color: #ffffff;
  box-sizing: border-box;
}

.form-input:hover {
  border-color: #40a9ff;
}

.form-input:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input::placeholder {
  color: #bfbfbf;
}

:deep(.select-container) {
  display: flex;
  position: relative;
}

:deep(.select-box) {
  flex: 1;
  height: 40px;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  font-size: 14px;
  color: #262626;
  outline: none;
  transition: all 0.2s;
}

:deep(.select-box:hover) {
  border-color: #40a9ff;
}

:deep(.select-box:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.select-box.active) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

/* 에러 상태일 때의 select-box 스타일 */
:deep(.input-error .select-box) {
  border-color: #ff4d4f !important;
}

:deep(.input-error .select-box:hover),
:deep(.input-error .select-box:focus),
:deep(.input-error .select-box.active) {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
}

:deep(.arrow-down) {
  border: solid #8c8c8c;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-left: 8px;
  transition: transform 0.2s;
}

:deep(.select-box.active .arrow-down) {
  transform: rotate(-135deg);
}

:deep(.dropdown-list) {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.dropdown-item) {
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #262626;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.dropdown-item:hover) {
  background-color: #f5f5f5;
}

:deep(.dropdown-item.selected) {
  background-color: #e6f7ff;
}

:deep(.flavor-detail),
:deep(.network-detail) {
  font-size: 12px;
  color: #8c8c8c;
}

.action-buttons {
  margin-top: 32px;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}

/* 버튼 기본 스타일 */
.btn {
  height: 40px;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  color: #262626;
}

/* 중복 확인 버튼 */
.btn-check {
  height: 38px;
  padding: 7px 16px;
  white-space: nowrap;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  color: #262626;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.btn-check:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.btn-check:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

/* 취소 버튼 */
.btn-cancel:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

/* 생성 버튼 */
.btn-create {
  background-color: #1890ff;
  border: 1px solid #1890ff;
  color: #ffffff;
}

.btn-create:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.btn-create:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  padding: 16px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #ff4d4f;
}

.input-error {
  border-color: #ff4d4f !important;
}

.input-error:hover,
.input-error:focus {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
}

.error-text {
  display: block;
  margin-top: 4px;
  color: #ff4d4f;
  font-size: 12px;
}

.name-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.name-input-group .form-input {
  flex: 1;
}

.name-input-group .btn-check {
  width: auto;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-check:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

.success-text {
  display: block;
  margin-top: 4px;
  color: #52c41a;
  font-size: 12px;
}

.btn-check:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed;
}

/* 반응형 스타일 */
/* 모바일 - 768px 이하 */
@media (max-width: 768px) {
  .instance-create {
    padding: 16px;
  }

  .action-bar,
  .action-buttons {
    max-width: 100%;
    padding: 0;
  }

  .page-title {
    display: block;
    min-width: 0;
  }

  .page-title h2 {
    font-size: 18px;
    margin: 0 0 4px 0;
    white-space: nowrap;
  }

  .page-title p {
    font-size: 12px;
    margin: 0;
    white-space: normal;
    color: #8c8c8c;
  }

  .create-form-container {
    flex-direction: column;
  }

  .preview-section {
    width: 100%;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-input,
  :deep(.select-box) {
    height: 36px;
    font-size: 13px;
  }

  :deep(.dropdown-item) {
    padding: 8px 12px;
    font-size: 13px;
  }

  .name-input-group {
    display: flex;
    gap: 8px;
  }

  .name-input-group .form-input {
    flex: 1;
    min-width: 0;
  }

  .name-input-group .btn-check {
    width: fit-content;
    padding: 6px 12px;
    font-size: 13px;
    height: 36px;
    flex: none;
  }

  .action-buttons {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 12px;
    height: 36px;
    min-width: 120px;
  }

  .action-buttons .btn {
    flex: 1;
  }

  .error-text {
    font-size: 11px;
  }

  .btn-check {
    height: 36px;
    padding: 6px 12px;
    font-size: 13px;
  }
  .success-text {
    font-size: 11px;
  }
}

/* 태블릿 - 768px 초과 ~ 1024px 이하 */
@media (max-width: 1024px) {
  .instance-create {
    padding: 20px;
    max-width: 1024px;
    margin: 0 auto;
  }

  .action-bar {
    margin-bottom: 20px;
    width: 100%;
  }

  .create-form-container {
    flex-direction: column;
    width: 100%;
  }

  .form-section,
  .preview-section {
    width: 100%;
    max-width: 100%;
  }

  .page-title h2 {
    font-size: 19px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .action-buttons {
    width: 100%;
    margin-top: 32px;
  }
}

/* 데스크탑 - 1024px 초과 ~ 1440px 이하 */
@media (max-width: 1440px) {
  .action-bar,
  .action-buttons {
    max-width: 1192px;
  }
  .create-form-container {
    gap: 24px;
  }
}

/* 대형 데스크탑 - 1440px 초과 */
@media (min-width: 1441px) {
  .instance-create {
    padding: 24px 30px;
  }

  .preview-section {
    width: 400px;
  }
}
</style>
