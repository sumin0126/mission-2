<template>
  <div class="section-box">
    <div class="section-header">
      <h3>리소스 정보</h3>
      <button class="btn-edit" @click="openModal">
        <span class="edit-icon">✎</span>
      </button>
    </div>
    <div class="section-content">
      <div class="info-row">
        <span class="label">CPU</span>
        <span class="value">{{ currentInstance?.cpu || '-' }}코어</span>
      </div>
      <div class="info-row">
        <span class="label">메모리</span>
        <span class="value">{{ currentInstance?.memory || '-' }}GB</span>
      </div>
      <div class="info-row">
        <span class="label">디스크</span>
        <span class="value">{{ currentInstance?.disk || '-' }}GB</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Instance } from '@/mock/types/instance'
import EditResourceInfoModal from './EditResourceInfoModal.vue'
import { useInstancesStore } from '@/stores/instances'
import { mockFlavors } from '@/mock/data/flavors'

const props = defineProps<{
  instance: Instance | null
}>()

const instancesStore = useInstancesStore()
const isModalOpen = ref(false)

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
      throw new Error('선택된 flavor를 찾을 수 없습니다.')
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
    console.error('인스턴스 업데이트 중 오류:', error)
    alert('인스턴스 정보 업데이트에 실패했습니다.')
  }
}
</script>

<style scoped>
.section-box {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #ffffff;
}

.section-header {
  padding: 16px 24px;
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
</style>
