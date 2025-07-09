<template>
  <div class="instance-detail">
    <div class="action-bar">
      <div class="page-title">
        <router-link :to="{ name: 'instanceList' }" class="back-button">
          <span class="back-arrow">←</span>
        </router-link>
        <h2>{{ instance?.name || 'Loading...' }}</h2>
      </div>
      <div class="action-buttons">
        <button class="btn btn-delete" @click="handleDelete" :disabled="instancesStore.isDeleting">
          {{ instancesStore.isDeleting ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </div>

    <div class="detail-section">
      <!-- 기본 정보 -->
      <InstanceBasicInfo :instance="instance" />
      <!-- 리소스 정보 -->
      <InstanceResourceInfo :instance="instance" />
      <!-- 네트워크 정보 -->
      <InstanceNetworkInfo :instance="instance" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InstanceBasicInfo from '@/components/instance/detail/BasicInfo.vue'
import InstanceResourceInfo from '@/components/instance/detail/ResourceInfo.vue'
import InstanceNetworkInfo from '@/components/instance/detail/NetworkInfo.vue'
import { useInstancesStore } from '@/stores/instances'
import type { Instance } from '@/mock/types/instance'

const router = useRouter()
const route = useRoute()
const instancesStore = useInstancesStore()
const instance = ref<Instance | null>(null)

// 컴포넌트 마운트 시 인스턴스 상세 정보 로드
onMounted(async () => {
  const id = route.params.id as string
  instance.value = await instancesStore.getInstance(id)
  console.log(route.params)
})

// 인스턴스 삭제
const handleDelete = async () => {
  const confirmed = confirm('해당 인스턴스를 삭제하시겠습니까?')

  if (confirmed) {
    try {
      await instancesStore.deleteInstance(instance.value!.id)
      router.push({ name: 'instanceList' })
    } catch (error) {
      alert('인스턴스를 삭제하는 중 오류가 발생했습니다.')
      console.error('인스턴스 삭제 중 오류:', error)
    }
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
