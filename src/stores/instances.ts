import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Instance, CreateInstanceRequest, UpdateInstanceRequest } from '@/mock/types/instance'
import type { Network } from '@/mock/types/network'
import * as instanceAPI from '@/api/instances'
import { mockNetworks } from '@/mock/data/networks'

// 내부 IP 할당 함수
const generatePrivateIp = () => {
  // 172.30.110.x 대역에서 랜덤한 IP 생성
  const lastOctet = Math.floor(Math.random() * (254 - 80 + 1)) + 80 // 80~254 범위
  return `172.30.110.${lastOctet}`
}

// 외부 IP 할당 함수
const generatePublicIp = () => {
  // 203.0.113.x 대역에서 랜덤한 IP 생성 (TEST-NET-3 주소 범위 사용)
  const lastOctet = Math.floor(Math.random() * 254) + 1 // 1~254 범위
  return `203.0.113.${lastOctet}`
}

// 네트워크 타입 확인 함수
const getNetworkType = (networkName: string): 'private' | 'public' => {
  const network = mockNetworks.find((n) => n.name === networkName)
  return network?.type || 'private'
}

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
  const getInstances = async () => {
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
        // 배열을 새로 만들어서 반응성 보장
        instances.value = [
          ...instances.value.slice(0, index),
          response.data,
          ...instances.value.slice(index + 1),
        ]
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
      // 내부 IP 할당
      let privateIp = generatePrivateIp()
      while (instances.value.some((inst) => inst.privateIp === privateIp)) {
        // 중복 시, 새로운 IP 할당
        privateIp = generatePrivateIp()
      }

      // 외부 IP 할당
      let publicIp: string | undefined
      if (getNetworkType(data.network) === 'public') {
        publicIp = generatePublicIp()
        while (instances.value.some((inst) => inst.publicIp === publicIp)) {
          publicIp = generatePublicIp()
        }
      }

      const instanceData = {
        ...data,
        privateIp,
        publicIp,
      }

      const response = await instanceAPI.createInstance(instanceData)
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
        // 배열을 새로 만들어서 반응성 보장
        instances.value = [
          ...instances.value.slice(0, index),
          response.data,
          ...instances.value.slice(index + 1),
        ]
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
        // 배열을 새로 만들어서 반응성 보장
        instances.value = [
          ...instances.value.slice(0, index),
          response.data,
          ...instances.value.slice(index + 1),
        ]
      }
      return response.data
    } catch (err) {
      console.error('인스턴스 전원 상태 변경 실패:', err)
      throw err
    } finally {
      isTogglingPower.value = false
    }
  }

  // 인스턴스 전원 상태 업데이트
  const updatePowerStatus = async (
    instanceId: string,
    data: { powerOn: boolean; status: 'RUNNING' | 'SHUTDOWN' }
  ) => {
    isTogglingPower.value = true
    try {
      const response = await instanceAPI.toggleInstancePower(instanceId, data)
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
        // 배열을 새로 만들어서 반응성 보장
        instances.value = [
          ...instances.value.slice(0, index),
          response.data,
          ...instances.value.slice(index + 1),
        ]
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
    getInstances,
    updatePowerStatus,
  }
})
