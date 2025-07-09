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
            type="text"
            v-model="instanceName"
            placeholder="이름을 입력해 주세요."
            class="form-input"
          />
        </div>

        <!-- 이미지 선택 -->
        <div class="form-group">
          <label>이미지<span class="required">*</span></label>
          <ImageSelect v-model="selectedImage" />
        </div>

        <!-- Flavor 선택 -->
        <div class="form-group">
          <label>Flavor<span class="required">*</span></label>
          <FlavorSelect v-model="selectedFlavor" @update:flavor-detail="updateFlavorDetail" />
        </div>

        <!-- 네트워크 선택 -->
        <div class="form-group">
          <label>네트워크<span class="required">*</span></label>
          <NetworkSelect v-model="selectedNetwork" />
        </div>
      </div>

      <!-- 선택된 사양 미리보기 -->
      <div class="preview-section">
        <div class="preview-box">
          <h3>선택된 사양 미리보기</h3>
          <div class="preview-content">
            <div class="preview-item">
              <span class="label">이름</span>
              <span class="value">{{ instanceName || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">이미지</span>
              <span class="value">{{ selectedImage || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">CPU</span>
              <span class="value">{{ selectedFlavorDetail.cpu || '-' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">메모리</span>
              <span class="value">{{
                selectedFlavorDetail.memory ? selectedFlavorDetail.memory + 'GB' : '-'
              }}</span>
            </div>
            <div class="preview-item">
              <span class="label">디스크</span>
              <span class="value">{{
                selectedFlavorDetail.disk ? selectedFlavorDetail.disk + 'GB' : '-'
              }}</span>
            </div>
            <div class="preview-item">
              <span class="label">네트워크</span>
              <span class="value">{{ selectedNetwork || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼 영역 -->
    <div class="action-buttons">
      <button class="btn btn-cancel" @click="cancel">취소</button>
      <button
        class="btn btn-create"
        :disabled="!isFormValid || instanceStore.isLoading"
        @click="createInstance"
      >
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

const router = useRouter()
const instanceStore = useInstancesStore()

// 폼 데이터
const instanceName = ref('')
const selectedImage = ref('')
const selectedFlavor = ref('')
const selectedNetwork = ref('')
const selectedFlavorDetail = ref<{ cpu?: number; memory?: number; disk?: number }>({})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    instanceName.value.trim() !== '' &&
    selectedImage.value !== '' &&
    selectedFlavor.value !== '' &&
    selectedNetwork.value !== ''
  )
})

// Flavor 상세 정보 업데이트
const updateFlavorDetail = (flavor: Flavor) => {
  selectedFlavorDetail.value = {
    cpu: flavor.cpu,
    memory: flavor.memory,
    disk: flavor.disk,
  }
}

// 인스턴스 생성 함수
const createInstance = async () => {
  if (!isFormValid.value) return

  try {
    await instanceStore.createInstance({
      name: instanceName.value,
      image: selectedImage.value,
      flavor: selectedFlavor.value,
      network: selectedNetwork.value,
    })
    router.push({ name: 'instanceList' })
  } catch (error) {
    console.error('인스턴스 생성 실패:', error)
  }
}

// 취소 함수
const cancel = () => {
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
}

:deep(.select-box:hover) {
  border-color: #40a9ff;
}

:deep(.select-box.active) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
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
}

.preview-box h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
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
