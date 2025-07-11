<template>
  <div class="instance-detail">
    <div class="action-bar">
      <div class="page-title">
        <router-link :to="{ name: 'instanceList' }" class="back-button">
          <span class="back-arrow">←</span>
        </router-link>
        <h2>{{ instance?.name || t('instance.detail.loading') }}</h2>
      </div>
      <div class="action-buttons">
        <button class="btn btn-delete" @click="handleDelete" :disabled="instancesStore.isDeleting">
          {{
            instancesStore.isDeleting
              ? t('instance.detail.deleteButton.deleting')
              : t('instance.detail.deleteButton.delete')
          }}
        </button>
      </div>
    </div>

    <div class="detail-section">
      <!-- 기본 정보 -->
      <BasicInfo :instance="instance" />
      <!-- 리소스 정보 -->
      <ResourceInfo :instance="instance" />
      <!-- 네트워크 정보 -->
      <NetworkInfo :instance="instance" />
    </div>

    <!-- 인스턴스 삭제 확인 모달 -->
    <ConfirmModal
      v-model="showDeleteModal"
      :title="t('instance.detail.deleteConfirm.title')"
      :message="t('instance.detail.deleteConfirm.message', { name: instance?.name })"
      :confirm-text="t('common.button.confirm')"
      :cancel-text="t('common.button.cancel')"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useInstancesStore } from '@/stores/instances'
import { useLoadingStore } from '@/stores/loading'
import { BasicInfo, NetworkInfo, ResourceInfo } from '@/components/instance/detail/components'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import type { Instance } from '@/mock/types/instance'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const instancesStore = useInstancesStore()
const loadingStore = useLoadingStore()
const instance = ref<Instance | null>(null)
const showDeleteModal = ref(false)

// 컴포넌트 마운트 시 인스턴스 상세 정보 로드
onMounted(async () => {
  const id = route.params.id as string
  instance.value = await instancesStore.getInstance(id)
  console.log(route.params)
})

// 스토어의 인스턴스 데이터가 변경될 때마다 현재 인스턴스 데이터 업데이트
watch(
  () => instancesStore.instances,
  async (newInstances) => {
    const id = route.params.id as string
    const updatedInstance = newInstances.find((inst) => inst.id === id)
    if (updatedInstance) {
      // 최신 데이터로 업데이트
      instance.value = { ...updatedInstance }
    }
  },
  { deep: true, immediate: true }
)

// 삭제 버튼 클릭 시
const handleDelete = async () => {
  // 오늘 하루 보지 않기 설정 확인
  const dontShowDate = localStorage.getItem('dontShowDeleteConfirm')
  const today = new Date().toDateString()

  if (dontShowDate === today) {
    // 오늘 하루 보지 않기가 설정되어 있으면 바로 삭제 진행
    await handleDeleteConfirm(true)
  } else {
    // 설정이 없으면 모달 표시
    showDeleteModal.value = true
  }
}

// 삭제 확인 버튼 클릭 시
const handleDeleteConfirm = async (dontShowToday: boolean) => {
  try {
    await loadingStore.withLoading(
      async () => {
        await instancesStore.deleteInstance(instance.value!.id)
        // 삭제 후 목록 데이터 업데이트 (로딩 없이)
        await instancesStore.getInstances()
      },
      500, // 최소 0.5초
      2000 // 최대 2초
    )

    if (dontShowToday) {
      localStorage.setItem('dontShowDeleteConfirm', new Date().toDateString())
    }
    router.push({ name: 'instanceList' })
  } catch (error) {
    alert(t('instance.detail.error.delete'))
    console.error(t('instance.detail.error.deleteLog'), error)
  }
}
</script>

<style scoped>
.instance-detail {
  padding: 24px;
}

.action-bar {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  text-decoration: none;
  color: #8c8c8c;
  font-size: 24px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.page-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.action-buttons {
  display: flex;
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
}

.btn-delete {
  background-color: #ffffff;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}

.btn-delete:hover {
  background-color: #fff1f0;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .instance-detail {
    padding: 16px;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .page-title h2 {
    font-size: 18px;
  }

  .btn {
    height: 36px;
    padding: 6px 16px;
    font-size: 13px;
  }
}
</style>
