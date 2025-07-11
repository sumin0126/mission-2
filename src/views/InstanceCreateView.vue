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
          <input
            ref="nameInput"
            type="text"
            v-model="formData.name"
            :placeholder="t('instance.create.form.name.placeholder')"
            class="form-input"
            :class="{ 'input-error': errors.name }"
            @keydown.enter="handleEnter('name')"
            @blur="validateField('name')"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
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
    <AlertModal
      v-model="showSuccessModal"
      :title="t('common.modal.notification')"
      :message="t('instance.create.success.message')"
      :confirm-text="t('common.button.confirm')"
      :show-dont-show-option="true"
      @confirm="handleSuccessConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FlavorSelect from '@/components/instance/create/FlavorSelect.vue'
import ImageSelect from '@/components/instance/create/ImageSelect.vue'
import NetworkSelect from '@/components/instance/create/NetworkSelect.vue'
import { useInstancesStore } from '@/stores/instances'
import InstancePreview from '@/components/InstancePreview.vue'
import AlertModal from '@/components/common/AlertModal.vue'
import type { Flavor } from '@/mock/types/flavor'
import type { CreateInstanceRequest } from '@/mock/types/instance'

// 타입 정의
type FormField = 'name' | 'image' | 'flavor' | 'network'
type FormErrors = Record<FormField, string>
type FormData = {
  name: string
  image: string
  flavor: string
  network: string
  flavorDetail: Flavor
}

const router = useRouter()
const instanceStore = useInstancesStore()
const { t } = useI18n()

// 상수 정의
const VALIDATION_MESSAGES = {
  name: t('instance.create.validation.name'),
  image: t('instance.create.validation.image'),
  flavor: t('instance.create.validation.flavor'),
  network: t('instance.create.validation.network'),
} as const

const INITIAL_FLAVOR: Flavor = {
  name: '',
  description: '',
  cpu: 0,
  memory: 0,
  disk: 0,
}

// 폼 필드 refs
const nameInput = ref<HTMLInputElement | null>(null)
const imageSelect = ref<InstanceType<typeof ImageSelect> | null>(null)
const flavorSelect = ref<InstanceType<typeof FlavorSelect> | null>(null)
const networkSelect = ref<InstanceType<typeof NetworkSelect> | null>(null)

// 폼 데이터
const formData = ref<FormData>({
  name: '',
  image: '',
  flavor: '',
  network: '',
  flavorDetail: { ...INITIAL_FLAVOR },
})

// 에러 상태
const errors = ref<FormErrors>({
  name: '',
  image: '',
  flavor: '',
  network: '',
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    Object.values(errors.value).every((error) => error === '') &&
    Object.entries(formData.value)
      .filter(([key]) => key !== 'flavorDetail')
      .every(([_, value]) => value !== '')
  )
})

// Flavor 상세 정보 업데이트
const updateFlavorDetail = (flavor: Flavor) => {
  formData.value.flavorDetail = flavor
}

// 필드 유효성 검사 함수
const validateField = (field: FormField) => {
  showInvalidPreview.value = false // 미리보기 박스 상태 초기화
  const value = field === 'name' ? formData.value[field].trim() : formData.value[field]
  errors.value[field] = value === '' ? VALIDATION_MESSAGES[field] : ''
  return errors.value[field] === ''
}

// 전체 폼 유효성 검사
const validateForm = () => {
  const fields: FormField[] = ['name', 'image', 'flavor', 'network']
  const isValid = fields.every((field) => validateField(field))
  if (isValid) {
    showInvalidPreview.value = false
  }
  return isValid
}

// 미리보기 박스 상태 (true - 빨간색 / false - 기본)
const showInvalidPreview = ref(false)

// 모달 상태
const showSuccessModal = ref(false)

// 생성 버튼 클릭 핸들러
const handleCreate = async () => {
  if (!validateForm()) {
    showInvalidPreview.value = true
    return
  }

  try {
    await instanceStore.createInstance({
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

    // 오늘 하루 보지 않기 설정 확인
    const dontShowDate = localStorage.getItem('dontShowCreateSuccess')
    const today = new Date().toDateString()

    if (dontShowDate === today) {
      // 설정이 있으면 바로 목록 페이지로 이동
      router.push({ name: 'instanceList' })
    } else {
      // 설정이 없으면 성공 모달 표시
      showSuccessModal.value = true
    }
  } catch (error) {
    alert('인스턴스를 생성하는 중 오류가 발생했습니다.')
    console.error('인스턴스 생성 중 오류:', error)
  }
}

// 성공 모달 확인 버튼 클릭 시
const handleSuccessConfirm = (dontShowToday: boolean) => {
  if (dontShowToday) {
    // 오늘 하루 보지 않기 설정 저장
    localStorage.setItem('dontShowCreateSuccess', new Date().toDateString())
  }
  router.push({ name: 'instanceList' })
}

// 필드 간 이동 핸들러
const handleEnter = (currentField: FormField) => {
  if (!validateField(currentField)) return

  const fieldOrder: FormField[] = ['name', 'image', 'flavor', 'network']
  const currentIndex = fieldOrder.indexOf(currentField)
  const nextField = fieldOrder[currentIndex + 1]

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

// 취소 핸들러
const handleCancel = () => {
  router.push({ name: 'instanceList' })
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
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  height: 40px;
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
  position: relative;
}

:deep(.select-box) {
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

.btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  height: 40px;
  min-width: 80px;
}

.btn-cancel {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  color: #262626;
}

.btn-cancel:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

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

  .action-buttons {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }

  .btn {
    flex: 1;
    padding: 6px 12px;
    font-size: 12px;
    height: 36px;
    min-width: 120px;
  }

  .error-text {
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
    padding: 0 16px;
  }

  .create-form-container {
    flex-direction: column;
    width: 100%;
    padding: 0 16px;
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
    padding: 0 16px;
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
