<template>
  <div class="section-box">
    <div class="section-header">
      <h3>{{ t('instance.detail.resourceInfo.title') }}</h3>
      <button class="btn-edit" @click="openModal">
        <span class="edit-icon">✎</span>
      </button>
    </div>
    <div class="section-content">
      <div class="info-row">
        <span class="label">{{ t('instance.detail.resourceInfo.cpu') }}</span>
        <span class="value"
          >{{ currentInstance?.cpu || '-' }}{{ t('instance.detail.resourceInfo.unit.core') }}</span
        >
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.resourceInfo.memory') }}</span>
        <span class="value"
          >{{ currentInstance?.memory || '-' }}{{ t('instance.detail.resourceInfo.unit.gb') }}</span
        >
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.resourceInfo.disk') }}</span>
        <span class="value"
          >{{ currentInstance?.disk || '-' }}{{ t('instance.detail.resourceInfo.unit.gb') }}</span
        >
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditResourceInfoModal
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
import { EditResourceInfoModal } from '../modals'
import { useInstancesStore } from '@/stores/instances'
import AppAlertModal from '@/components/common/AppAlertModal.vue'
import { mockFlavors } from '@/mock/data/flavors'

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
const handleSave = async (data: { flavor: string }) => {
  if (!currentInstance.value) return

  try {
    // 선택된 flavor의 리소스 정보 가져오기
    const selectedFlavor = mockFlavors.find((f) => f.name === data.flavor)
    if (!selectedFlavor) {
      throw new Error(t('instance.detail.resourceInfo.error.flavorNotFound'))
    }

    // 리소스 정보 업데이트 (flavor와 관련 리소스 값들 모두 업데이트)
    await instancesStore.updateInstance(currentInstance.value.id, {
      flavor: data.flavor,
      cpu: selectedFlavor.cpu,
      memory: selectedFlavor.memory,
      disk: selectedFlavor.disk,
    })

    // 변경 사항 적용 후 인스턴스 정보 새로고침
    await instancesStore.getInstance(currentInstance.value.id)
    closeModal()
  } catch (error) {
    console.error(t('instance.detail.resourceInfo.error.updateLog'), error)
    errorMessage.value = t('instance.detail.resourceInfo.error.update')
    showErrorModal.value = true
  }
}

// 에러 모달 닫기
const handleErrorModalClose = () => {
  showErrorModal.value = false
}
</script>

<style scoped>
/* 공통 스타일 */
@import '@/assets/styles/components/instance-detail.css';
</style>
