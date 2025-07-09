<template>
  <div class="instance-create">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="page-title">
        <h2>Instance</h2>
        <p>새로운 인스턴스를 생성합니다</p>
      </div>
    </div>

    <!-- 생성 폼 -->
    <div class="create-form-container">
      <div class="form-section">
        <!-- 인스턴스 이름 입력 -->
        <div class="form-group">
          <label>인스턴스 이름<span class="required">*</span></label>
          <input
            ref="nameInput"
            type="text"
            v-model="formData.name"
            placeholder="이름을 입력해 주세요."
            class="form-input"
            :class="{ 'input-error': errors.name }"
            @keydown.enter="handleEnter('name')"
            @blur="validateField('name')"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <!-- 이미지 선택 -->
        <div class="form-group">
          <label>이미지<span class="required">*</span></label>
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
          <label>Flavor<span class="required">*</span></label>
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
          <label>네트워크<span class="required">*</span></label>
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
        <div
          class="preview-box"
          :class="{
            'preview-box-valid': isFormValid,
            'preview-box-invalid': showInvalidPreview,
          }"
        >
          <h3>선택된 사양 미리보기</h3>
          <div class="preview-content">
            <div class="preview-item">
              <span class="label">이름</span>
              <span class="value">{{ formData.name || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">이미지</span>
              <span class="value">{{ formData.image || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">CPU</span>
              <span class="value">{{ formData.flavorDetail.cpu || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">메모리</span>
              <span class="value">{{
                formData.flavorDetail.memory ? formData.flavorDetail.memory + 'GB' : '-'
              }}</span>
            </div>
            <div class="preview-item">
              <span class="label">디스크</span>
              <span class="value">{{
                formData.flavorDetail.disk ? formData.flavorDetail.disk + 'GB' : '-'
              }}</span>
            </div>
            <div class="preview-item">
              <span class="label">네트워크</span>
              <span class="value">{{ formData.network || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 영역 -->
    <div class="action-buttons">
      <button class="btn btn-cancel" @click="handleCancel">취소</button>
      <button class="btn btn-create" :disabled="instanceStore.isLoading" @click="handleCreate">
        {{ instanceStore.isLoading ? '생성 중...' : '생성' }}
      </button>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="instanceStore.error" class="error-message">
      {{ instanceStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInstancesStore } from '@/stores/instances'
import ImageSelect from '@/components/ImageSelect.vue'
import FlavorSelect from '@/components/FlavorSelect.vue'
import NetworkSelect from '@/components/NetworkSelect.vue'
import type { Flavor } from '@/mock/types/flavor'

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

// 상수 정의
const VALIDATION_MESSAGES = {
  name: '인스턴스 이름을 입력해주세요.',
  image: '이미지를 선택해주세요.',
  flavor: 'Flavor를 선택해주세요.',
  network: '네트워크를 선택해주세요.',
} as const

const INITIAL_FLAVOR: Flavor = {
  name: '',
  description: '',
  cpu: 0,
  memory: 0,
  disk: 0,
}

const router = useRouter()
const instanceStore = useInstancesStore()

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

// 생성 버튼 클릭 핸들러
const handleCreate = async () => {
  if (!validateForm()) {
    showInvalidPreview.value = true
    return
  }

  try {
    await instanceStore.createInstance({
      name: formData.value.name,
      image: formData.value.image,
      flavor: formData.value.flavor,
      network: formData.value.network,
      cpu: formData.value.flavorDetail.cpu,
      memory: formData.value.flavorDetail.memory,
      disk: formData.value.flavorDetail.disk,
      status: 'RUNNING',
      powerOn: true,
      createdAt: new Date().toISOString(),
    })
    router.push({ name: 'instanceList' })
  } catch (error) {
    console.error('인스턴스 생성 실패:', error)
  }
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

/* 선택 컴포넌트 스타일 오버라이드 */
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

.preview-box {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.3s ease;
}

.preview-box-valid {
  background-color: rgba(2, 103, 255, 0.05); /* #0267ff with 5% opacity */
  border-color: #1890ff; /* 생성 버튼과 동일한 색상의 테두리 */
}

.preview-box-invalid {
  background-color: rgba(255, 77, 79, 0.05); /* #ff4d4f with 5% opacity */
  border-color: #ff4d4f; /* 생성 버튼과 동일한 색상의 테두리 */
}

.preview-box h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45); /* 더 연한 색상으로 변경 */
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

  .action-bar {
    margin-bottom: 16px;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .page-title h2 {
    font-size: 18px;
    margin: 0;
    white-space: nowrap;
  }

  .page-title p {
    font-size: 12px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
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

  .preview-box {
    padding: 12px;
  }

  .preview-box h3 {
    font-size: 15px;
    margin-bottom: 16px;
  }

  .preview-content {
    gap: 12px;
  }

  .preview-item {
    font-size: 13px;
  }

  .action-buttons {
    margin-top: 24px;
    flex-direction: column;
    gap: 8px;
  }

  .btn {
    width: 100%;
    padding: 6px 12px;
    font-size: 12px;
    height: 36px;
  }

  .error-text {
    font-size: 11px;
  }
}

/* 태블릿 - 768px 초과 ~ 1024px 이하 */
@media (max-width: 1024px) {
  .instance-create {
    padding: 20px;
  }

  .create-form-container {
    flex-direction: column;
  }

  .preview-section {
    width: 100%;
    max-width: 800px;
  }

  .form-section,
  .preview-section {
    margin: 0 auto;
    width: 100%;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .page-title h2 {
    font-size: 19px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .preview-box {
    padding: 16px;
  }
}

/* 데스크탑 - 1024px 초과 ~ 1440px 이하 */
@media (max-width: 1440px) {
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
