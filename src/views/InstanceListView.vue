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

    <!-- 인스턴스 테이블 -->
    <div class="table-container">
      <table class="instance-table">
        <thead>
          <tr>
            <!- 체크박스 전체 선택 -->
            <th class="checkbox-column">
              <input type="checkbox" @change="selectAll" :checked="isAllSelected" />
            </th>
            <th>인스턴스</th>
            <th>전원상태</th>
            <th>CPU</th>
            <th>메모리</th>
            <th>디스크</th>
            <th>IP 주소</th>
            <th>전원관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="instance in instanceStore.instances" :key="instance.id">
            <!-- 1) 체크박스 -->
            <!-- 사용자가 체크 박스 클릭 ->  selectedInstanceIds 배열에 해당 ID 추가 -->
            <td class="checkbox-column">
              <input type="checkbox" :value="instance.id" v-model="selectedInstanceIds" />
            </td>
            <!-- 2) 인스턴스 이름 -->
            <td>
              <span class="instance-name">{{ instance.name }}</span>
            </td>
            <!-- 3) 전원 상태 -->
            <td>
              <span
                class="status-tag"
                :class="{
                  'status-running': instance.status === 'RUNNING',
                  'status-shutdown': instance.status === 'SHUTDOWN',
                }"
              >
                {{ instance.status }}
              </span>
            </td>
            <!-- 4) CPU -->
            <td>{{ instance.cpu }}코어</td>
            <!-- 5) 메모리 -->
            <td>{{ instance.memory }}GB</td>
            <!-- 6) 디스크 -->
            <td>{{ instance.disk }}GB</td>
            <!-- 7) 내부 IP 주소 -->
            <td>{{ instance.privateIp }}</td>
            <!-- 8) 전원 제어 토글 -->
            <td>
              <label class="power-switch">
                <input
                  type="checkbox"
                  :checked="instance.powerOn"
                  @change="togglePower(instance)"
                />
                <span class="slider"></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useInstanceStore } from '@/stores/instances'
import type { Instance } from '@/mock/types/instance'

const instanceStore = useInstanceStore()
const selectedInstanceIds = ref<string[]>([]) // 선택된 인스턴스 ID들을 저장할 배열

// 컴포넌트 마운트 시 인스턴스 목록 로드
onMounted(async () => {
  await instanceStore.getInstances()
})

// 모든 인스턴스가 선택되었는지를 판단하는 함수 (boolean 반환)
const isAllSelected = computed(() => {
  return (
    instanceStore.instances.length > 0 &&
    selectedInstanceIds.value.length === instanceStore.instances.length
  )
})

// 전체 선택/해제 함수
const selectAll = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    selectedInstanceIds.value = instanceStore.instances.map((instance) => instance.id)
  } else {
    selectedInstanceIds.value = []
  }
}

// 전원 토글 함수
const togglePower = async (instance: Instance) => {
  try {
    await instanceStore.toggleInstancePower(instance.id)
    console.log(`${instance.name} 전원 상태 변경:`, instance.powerOn)
  } catch (error) {
    console.error('전원 상태 변경 실패:', error)
  }
}

// 인스턴스 다중 삭제 함수
const deleteSelectedInstances = async () => {
  if (selectedInstanceIds.value.length === 0) return

  const confirmed = confirm(
    `선택한 ${selectedInstanceIds.value.length}개의 인스턴스를 삭제하시겠습니까?`
  )
  if (confirmed) {
    try {
      await instanceStore.bulkDeleteInstances(selectedInstanceIds.value)
      selectedInstanceIds.value = []
      console.log('선택된 인스턴스들이 삭제되었습니다.')
    } catch (error) {
      console.error('인스턴스 삭제 실패:', error)
    }
  }
}

// 인스턴스 생성 페이지로 이동하는 함수
const navigateToCreatePage = () => {
  // 생성 페이지로 이동하는 로직 추가
  console.log('인스턴스 생성 페이지로 이동')
}
</script>

<style scoped>
.instance-list {
  padding: 24px;
  background-color: #ffffff;
  height: 100%; /* 컨텐츠 높이에 맞춤 */
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
}

.instance-table tbody tr:hover {
  background-color: #f5f5f5;
}

.instance-table tbody tr:last-child td {
  border-bottom: none;
}

.checkbox-column {
  width: 60px;
}

.instance-name {
  font-weight: 500;
  color: #262626;
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

/* 스위치 스타일 */
.power-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  cursor: pointer;
}

/* 커스텀 스위치를 보여주기 위해 기본 input 요소 숨김 처리 */
.power-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 22px;
  transition: 0.3s;
}

/* 슬라이더 원형 버튼 - 가상 요소 생성 */
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

/* 체크된 상태의 슬라이더 배경 - 체크박스가 선택된 상태일때, 바로 다음에 오는 .slider 요소 선택 */
input:checked + .slider {
  background-color: #1890ff;
}

/* 체크된 상태의 슬라이더 원형 버튼 */
input:checked + .slider:before {
  transform: translateX(22px);
}

.slider:hover {
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}

/* 전체 체크박스 스타일 */
input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 반응형 스타일 */
/* 모바일 - 768px 이하 */
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

  .instance-table {
    font-size: 12px;
  }

  .instance-table th,
  .instance-table td {
    padding: 8px 12px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 12px;
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

/* 대형 데스크탑 - 1440px 초과 */
@media (min-width: 1441px) {
  .instance-list {
    padding: 24px 30px;
  }
}
</style>
