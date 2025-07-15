<template>
  <div class="instance-list">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="page-title">
        <h2>{{ t('instance.title') }}</h2>
        <p>{{ t('instance.list.description') }}</p>
      </div>
      <div class="action-buttons">
        <button
          class="btn btn-danger"
          :disabled="selectedInstanceIds.length === 0"
          @click="deleteSelectedInstances"
        >
          {{ t('common.button.delete') }}
        </button>
        <button class="btn btn-primary" @click="navigateToCreatePage">
          {{ t('common.button.create') }}
        </button>
      </div>
    </div>

    <!-- 인스턴스 테이블 컴포넌트 -->
    <InstanceTable
      :instances="instanceStore.instances"
      :is-loading="instanceStore.isLoading"
      :error="instanceStore.error"
      @select="handleInstanceSelection"
      @togglePower="handlePowerToggle"
    />

    <!-- 삭제 확인 모달 -->
    <AppConfirmModal
      v-model="showDeleteConfirmModal"
      :title="t('instance.delete.title')"
      :message="t('instance.delete.message', { count: selectedInstanceIds.length })"
      :confirm-text="t('common.button.delete')"
      :cancel-text="t('common.button.cancel')"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInstancesStore } from '@/stores/instances'
import { useLoadingStore } from '@/stores/loading'
import type { Instance } from '@/mock/types/instance'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import InstanceTable from '@/components/instance/list/InstanceTable.vue'
import AppConfirmModal from '@/components/common/AppConfirmModal.vue'

const instanceStore = useInstancesStore()
const loadingStore = useLoadingStore()
const selectedInstanceIds = ref<string[]>([])
const router = useRouter()
const { t } = useI18n()

// 삭제 확인 모달 상태
const showDeleteConfirmModal = ref(false)

// 컴포넌트 마운트 시 인스턴스 목록 로드
onMounted(async () => {
  // 생성 페이지에서 왔을 때는 이미 목록이 업데이트되어 있으므로 로딩 없이 진행
  if (instanceStore.instances.length > 0) {
    return
  }

  try {
    await loadingStore.withLoading(() => instanceStore.getInstances())
  } catch (error) {
    console.error('인스턴스 목록 로드 실패:', error)
  }
})

// 인스턴스 선택 처리
const handleInstanceSelection = (ids: string[]) => {
  selectedInstanceIds.value = ids
}

// 전원 토글 처리
const handlePowerToggle = async (instance: Instance) => {
  try {
    await instanceStore.toggleInstancePower(instance.id)
  } catch (error) {
    console.error('전원 상태 변경 실패:', error)
  }
}

// 인스턴스 삭제 처리
const handleDelete = async (ids: string[]) => {
  try {
    // 순차적으로 삭제 처리
    for (const id of ids) {
      await instanceStore.deleteInstance(id)
    }
    // 삭제 후 목록 갱신
    await instanceStore.getInstances()
  } catch (error) {
    console.error('인스턴스 삭제 실패:', error)
  }
}

// 인스턴스 다중 삭제 함수
const deleteSelectedInstances = () => {
  if (selectedInstanceIds.value.length === 0) return
  showDeleteConfirmModal.value = true
}

// 삭제 확인 시
const handleDeleteConfirm = async (dontShowToday: boolean) => {
  try {
    await loadingStore.withLoading(async () => {
      // 순차적으로 삭제 처리
      for (const id of selectedInstanceIds.value) {
        await instanceStore.deleteInstance(id)
      }
      selectedInstanceIds.value = []
      // 삭제 후 목록 갱신
      await instanceStore.getInstances()

      // 오늘 하루 보지 않기 설정 저장
      if (dontShowToday) {
        localStorage.setItem('dontShowDeleteConfirm', new Date().toDateString())
      }
    })
  } catch (error) {
    console.error('인스턴스 삭제 실패:', error)
  }
}

// 인스턴스 생성 페이지로 이동하는 함수
const navigateToCreatePage = () => {
  router.push({ name: 'instanceCreate' })
}
</script>

<style scoped>
.instance-list {
  padding: 24px;
  background-color: #ffffff;
  height: 100%;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.action-buttons {
  display: flex;
  gap: 8px;
}

/* 버튼 스타일 */
.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #ffffff;
  color: #262626;
}

.btn:hover {
  border-color: #4096ff;
  color: #4096ff;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #f5f5f5;
  color: #bfbfbf;
}

.btn-primary {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
  color: #ffffff;
}

.btn-danger {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: #ffffff;
}

.btn-danger:hover {
  background-color: #ff7875;
  border-color: #ff7875;
  color: #ffffff;
}

.btn-danger:disabled {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #bfbfbf;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .instance-list {
    padding: 16px;
  }

  .action-bar {
    flex-direction: row;
    align-items: center;
    gap: 16px;
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

  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

/* 태블릿 - 768px 초과 ~ 1024px 이하 */
@media (min-width: 769px) and (max-width: 1024px) {
  .instance-list {
    padding: 20px;
  }

  .action-bar {
    margin-bottom: 20px;
  }

  .page-title h2 {
    font-size: 19px;
  }
}

/* 대형 데스크탑 - 1440px 초과 */
@media (min-width: 1441px) {
  .instance-list {
    padding: 24px 30px;
  }
}
</style>
