<template>
  <div>
    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-state">{{ t('instance.list.loading') }}</div>

    <!-- 인스턴스 테이블 -->
    <div v-else class="table-container">
      <table class="instance-table">
        <thead>
          <tr>
            <!-- 체크박스 전체 선택 -->
            <th class="checkbox-column">
              <input
                type="checkbox"
                @change="handleSelectAllInstances"
                :checked="isAllSelected"
                :disabled="!instances.length"
              />
            </th>
            <th>{{ t('instance.list.table.instance') }}</th>
            <th>{{ t('instance.list.table.powerStatus') }}</th>
            <th>{{ t('instance.list.table.cpu') }}</th>
            <th>{{ t('instance.list.table.memory') }}</th>
            <th>{{ t('instance.list.table.disk') }}</th>
            <th>{{ t('instance.list.table.ipAddress') }}</th>
            <th>{{ t('instance.list.table.powerManagement') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!instances.length">
            <td colspan="8" class="no-data">{{ t('instance.list.table.noData') }}</td>
          </tr>
          <!-- 체크박스 개별 선택 -->
          <tr v-else v-for="instance in instances" :key="instance.id">
            <td class="checkbox-column">
              <input
                type="checkbox"
                :value="instance.id"
                :checked="selectedIds.includes(instance.id)"
                @change="handleSelectInstance(instance.id)"
              />
            </td>
            <td>
              <span class="instance-link" @click="handleNavigateToDetail(instance.id)">
                {{ instance.name }}
              </span>
            </td>
            <td>
              <StatusBadge :status="instance.status" />
            </td>
            <td>{{ instance.cpu }}코어</td>
            <td>{{ instance.memory }}GB</td>
            <td>{{ instance.disk }}GB</td>
            <td>{{ instance.privateIp }}</td>
            <td>
              <PowerToggle :is-running="instance.powerOn" @toggle="handlePowerToggle(instance)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Instance } from '@/mock/types/instance'
import StatusBadge from './StatusBadge.vue'
import PowerToggle from './PowerToggle.vue'

interface Props {
  instances: Instance[]
  isLoading?: boolean
  error?: string | null
  selectedIds: string[] // 선택된 ID들을 props로 받음
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  selectedIds: () => [], // 기본값 설정
})

const emit = defineEmits<{
  (e: 'select', ids: string[]): void
  (e: 'togglePower', instance: Instance): void
}>()

const { t } = useI18n()
const router = useRouter()

// 체크박스 전체 선택
const isAllSelected = computed(() => {
  return props.instances.length > 0 && props.selectedIds.length === props.instances.length
})

// 전체 인스턴스 선택/해제 처리 이벤트 핸들러
const handleSelectAllInstances = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newSelectedIds = target.checked ? props.instances.map((instance) => instance.id) : []
  emit('select', newSelectedIds)
}

// 인스턴스 상세 페이지로 이동
const handleNavigateToDetail = (id: string) => {
  router.push({ name: 'instanceDetail', params: { id } })
}

// 체크박스 선택 처리
const handleSelectInstance = (id: string) => {
  const newSelectedIds = [...props.selectedIds]
  const index = newSelectedIds.indexOf(id)
  if (index === -1) {
    newSelectedIds.push(id)
  } else {
    newSelectedIds.splice(index, 1)
  }
  emit('select', newSelectedIds)
}

// 전원 토글 처리
const handlePowerToggle = async (instance: Instance) => {
  emit('togglePower', instance)
}
</script>

<style scoped>
/* 테이블 스타일 */
.table-container {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
}

.instance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.instance-table th {
  background-color: #fafafa;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
}

.instance-table th:last-child {
  border-right: none;
  padding: 12px 8px;
}

.instance-table td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  color: #262626;
}

.instance-table td:last-child {
  border-right: none;
  padding: 12px 8px;
}

.instance-table tbody tr:hover {
  background-color: #f5f5f5;
}

.instance-table tbody tr:last-child td {
  border-bottom: none;
}

.checkbox-column {
  width: 60px;
  text-align: center;
  vertical-align: middle;
}

.instance-link {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
}

.instance-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff4d4f;
  padding: 16px;
  text-align: center;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  margin-bottom: 16px;
}

.loading-state {
  text-align: center;
  padding: 24px;
  color: #8c8c8c;
}

.no-data {
  text-align: center;
  color: #8c8c8c;
  padding: 24px;
}

/* 체크박스 스타일 */
input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .instance-table {
    font-size: 12px;
  }

  .instance-table th,
  .instance-table td {
    padding: 8px 12px;
  }

  /* 모바일에서는 CPU, 메모리, 디스크 열 숨김 */
  .instance-table th:nth-child(4),
  .instance-table td:nth-child(4),
  .instance-table th:nth-child(5),
  .instance-table td:nth-child(5),
  .instance-table th:nth-child(6),
  .instance-table td:nth-child(6) {
    display: none;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .instance-table {
    font-size: 13px;
  }

  .instance-table th,
  .instance-table td {
    padding: 10px 14px;
  }

  /* 태블릿에서는 디스크 열만 숨김 */
  .instance-table th:nth-child(6),
  .instance-table td:nth-child(6) {
    display: none;
  }
}
</style>
