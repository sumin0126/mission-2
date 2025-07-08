import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Instance, CreateInstanceRequest, UpdateInstanceRequest } from '@/mock/types/instance'
import * as instanceAPI from '@/api/instances'

export const useInstancesStore = defineStore('instances', () => {
  const instances = ref<Instance[]>([])
  // API 요청이 동시에 발생할 경우, 하나의 로딩 상태로는 상태 관리가 어려울 것 같음
  const isLoading = ref(false) // 목록 조회 중 상태
  const isLoadingDetails = ref(false) // 상세 정보 조회 중 상태
  const isCreating = ref(false) // 생성 중 상태
  const isUpdating = ref(false) // 수정 중 상태
  const isDeleting = ref(false) // 삭제 중 상태
  const isTogglingPower = ref(false) // 전원 상태 변경 중 상태
  const error = ref<string | null>(null)

  // 인스턴스 목록 조회 (초기화)
  const initInstances = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await instanceAPI.getInstances()
      instances.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
      console.error('인스턴스 목록 초기화 실패:', err)
      error.value = '인스턴스 목록을 불러오는데 실패했습니다.'
      instances.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 인스턴스 단일 조회
  const getInstance = async (instanceId: string) => {
    isLoadingDetails.value = true
    try {
      const response = await instanceAPI.getInstance(instanceId)
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
        instances.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('인스턴스 조회 실패:', err)
      throw err
    } finally {
      isLoadingDetails.value = false
    }
  }

  // 인스턴스 생성
  const createInstance = async (data: CreateInstanceRequest) => {
    isCreating.value = true
    try {
      const response = await instanceAPI.createInstance(data)
      instances.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('인스턴스 생성 실패:', err)
      throw err
    } finally {
      isCreating.value = false
    }
  }

  // 인스턴스 수정
  const updateInstance = async (instanceId: string, data: UpdateInstanceRequest) => {
    isUpdating.value = true
    try {
      const response = await instanceAPI.updateInstance(instanceId, data)
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
        instances.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('인스턴스 수정 실패:', err)
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  // 인스턴스 삭제
  const deleteInstance = async (instanceId: string) => {
    isDeleting.value = true
    try {
      const response = await instanceAPI.deleteInstance(instanceId)
      instances.value = instances.value.filter((inst) => inst.id !== instanceId)
    } catch (err) {
      console.error('인스턴스 삭제 실패:', err)
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  // 인스턴스 전원 토글
  const toggleInstancePower = async (instanceId: string) => {
    const instance = instances.value.find((inst) => inst.id === instanceId)
    if (!instance) throw new Error(`인스턴스를 찾을 수 없습니다: ${instanceId}`)

    isTogglingPower.value = true
    try {
      const newPowerState = !instance.powerOn
      const response = await instanceAPI.toggleInstancePower(instanceId, {
        powerOn: newPowerState,
        status: newPowerState ? 'RUNNING' : 'SHUTDOWN',
      })

      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
        instances.value[index] = response.data
      }
      return response.data
    } catch (err) {
      console.error('인스턴스 전원 상태 변경 실패:', err)
      throw err
    } finally {
      isTogglingPower.value = false
    }
  }

  return {
    instances,
    isLoading,
    isLoadingDetails,
    isCreating,
    isUpdating,
    isDeleting,
    isTogglingPower,
    error,
    getInstance,
    createInstance,
    updateInstance,
    deleteInstance,
    toggleInstancePower,
    initInstances,
  }
})
