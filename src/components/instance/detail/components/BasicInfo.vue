<template>
  <div class="section-box">
    <div class="section-header">
      <h3>{{ t('instance.detail.basicInfo.title') }}</h3>
      <button class="btn-edit" @click="openModal">
        <span class="edit-icon">✎</span>
      </button>
    </div>
    <div class="section-content">
      <div class="info-row">
        <span class="label">{{ t('instance.detail.basicInfo.name') }}</span>
        <span class="value">{{ currentInstance?.name || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.basicInfo.image') }}</span>
        <span class="value">{{ currentInstance?.image || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.basicInfo.powerStatus') }}</span>
        <span class="value">
          <span
            class="status-tag"
            :class="{
              'status-running': currentInstance?.status === 'RUNNING',
              'status-shutdown': currentInstance?.status === 'SHUTDOWN',
            }"
          >
            {{ currentInstance?.status || '-' }}
          </span>
        </span>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditBasicInfoModal
      v-if="currentInstance"
      :is-open="isModalOpen"
      :instance="currentInstance"
      @close="closeModal"
      @save="handleSave"
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
import { useI18n } from 'vue-i18n'
import type { Instance } from '@/mock/types/instance'
import { EditBasicInfoModal } from '../modals'
import { useInstancesStore } from '@/stores/instances'
import AppAlertModal from '@/components/common/AppAlertModal.vue'

const { t } = useI18n()
const props = defineProps<{
  instance: Instance | null
}>()

const instancesStore = useInstancesStore()
const isModalOpen = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// 스토어에서 최신 인스턴스 데이터 가져오기
const currentInstance = computed(() => {
  if (!props.instance) return null
  return instancesStore.instances.find((inst) => inst.id === props.instance?.id) || props.instance
})

// 모달 오픈
const openModal = () => {
  isModalOpen.value = true
}

// 모달 오프
const closeModal = () => {
  isModalOpen.value = false
}

// 변경내용 저장
const handleSave = async (data: { name: string; power: string }) => {
  if (!currentInstance.value) return

  try {
    // 이름 업데이트
    if (data.name !== currentInstance.value.name) {
      await instancesStore.updateInstance(currentInstance.value.id, {
        name: data.name,
      })
    }

    // 전원 상태 업데이트
    const newPowerOn = data.power === 'on'
    if (newPowerOn !== currentInstance.value.powerOn) {
      await instancesStore.updatePowerStatus(currentInstance.value.id, {
        powerOn: newPowerOn,
        status: newPowerOn ? 'RUNNING' : 'SHUTDOWN',
      })
    }

    closeModal()
  } catch (error) {
    console.error(t('instance.detail.basicInfo.error.updateLog'), error)
    errorMessage.value = t('instance.detail.basicInfo.error.update')
    showErrorModal.value = true
  }
}

// 에러 모달 닫기
const handleErrorModalClose = () => {
  showErrorModal.value = false
}
</script>

<style scoped>
.section-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #ffffff;
}

.section-header {
  padding: 10px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.btn-edit {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #8c8c8c;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-edit:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.edit-icon {
  font-size: 16px;
}

.section-content {
  padding: 24px;
}

.info-row {
  display: flex;
  margin-bottom: 24px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 150px;
  color: #262626;
  font-size: 14px;
}

.info-row .value {
  flex: 1;
  color: #787878;
  font-size: 14px;
}

/* 상태 태그 스타일 */
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-running {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-shutdown {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}
</style>
