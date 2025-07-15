<template>
  <div class="section-box">
    <div class="section-header">
      <h3>{{ t('instance.detail.networkInfo.title') }}</h3>
      <button class="btn-edit" @click="openModal">
        <span class="edit-icon">✎</span>
      </button>
    </div>
    <div class="section-content">
      <div class="info-row">
        <span class="label">{{ t('instance.detail.networkInfo.network') }}</span>
        <span class="value">{{ currentInstance?.network || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.networkInfo.privateIp') }}</span>
        <span class="value">{{ currentInstance?.privateIp || '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">{{ t('instance.detail.networkInfo.publicIp') }}</span>
        <span class="value">{{ currentInstance?.publicIp || '-' }}</span>
      </div>
    </div>

    <!-- 수정 모달 -->
    <EditNetworkInfoModal
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
import type { Network } from '@/mock/types/network'
import { EditNetworkInfoModal } from '../modals'
import { useInstancesStore } from '@/stores/instances'
import { mockNetworks } from '@/mock/data/networks'
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
const handleSave = async (data: { network: string }) => {
  if (!currentInstance.value) return

  try {
    // 네트워크 정보 업데이트 - 스토어에서 자동으로 네트워크 타입에 따라 IP 관리
    await instancesStore.updateInstance(currentInstance.value.id, {
      network: data.network,
    })

    // 변경 사항 적용 후 인스턴스 정보 새로고침
    await instancesStore.getInstance(currentInstance.value.id)
    closeModal()
  } catch (error) {
    console.error(t('instance.detail.networkInfo.error.updateLog'), error)
    errorMessage.value = t('instance.detail.networkInfo.error.update')
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
