<template>
  <div class="instance-list">
    <!-- 상단 액션 바 -->
    <div class="action-bar">
      <div class="page-title">
        <h2>Instance</h2>
        <p>생성한 인스턴스를 조회 및 관리하실 수 있습니다</p>
      </div>
      <div class="action-buttons">
        <button
          class="btn btn-danger"
          :disabled="selectedInstanceIds.length === 0"
          @click="deleteSelectedInstances"
        >
          삭제
        </button>
        <button class="btn btn-primary" @click="navigateToCreatePage">생성</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInstancesStore } from '@/stores/instances'
import type { Instance } from '@/mock/types/instance'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import InstanceTable from '@/components/instance/list/InstanceTable.vue'

const instanceStore = useInstancesStore()
const selectedInstanceIds = ref<string[]>([])
const router = useRouter()
const { t } = useI18n()

// 컴포넌트 마운트 시 인스턴스 목록 로드
onMounted(async () => {
  try {
    await instanceStore.getInstances()
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

// 인스턴스 다중 삭제 함수
const deleteSelectedInstances = async () => {
  if (selectedInstanceIds.value.length === 0) return

  const confirmed = confirm(
    t('instance.messages.deleteConfirm', { count: selectedInstanceIds.value.length })
  )
  if (confirmed) {
    try {
      // 순차적으로 삭제 처리
      for (const id of selectedInstanceIds.value) {
        await instanceStore.deleteInstance(id)
      }
      selectedInstanceIds.value = []
      // 삭제 후 목록 갱신
      await instanceStore.getInstances()
    } catch (error) {
      console.error('인스턴스 삭제 실패:', error)
    }
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
