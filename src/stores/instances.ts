// 인스턴스 CRUD 및 전원 제어 로직, 내부/외부 IP 자동 할당
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Instance, CreateInstanceRequest, UpdateInstanceRequest } from '@/mock/types/instance'
import type { Network } from '@/mock/types/network'
import * as instanceAPI from '@/api/instances'
import { mockNetworks } from '@/mock/data/networks'

// 내부 IP 할당 함수
const generatePrivateIp = () => {
  // 앞에 3개의 옥텟은 고정하고 마지막 옥텟만 생성
  const lastOctet = Math.floor(Math.random() * (254 - 80 + 1)) + 80
  // 172.30.110.80 ~ 172.30.110.254 사이에 랜덤한 IP 생성
  return `172.30.110.${lastOctet}`
}

// 외부 IP 할당 함수
const generatePublicIp = () => {
  const lastOctet = Math.floor(Math.random() * 254) + 1
  return `203.0.113.${lastOctet}`
}

// 네트워크 타입 확인 함수
const getNetworkType = (networkName: string): 'private' | 'public' => {
  const network = mockNetworks.find((n) => n.name === networkName)
  // 타입 단언(as)를 사용하면 반환값이 둘 중 하나임을 보장함
  return network?.type as 'private' | 'public'
}

// 인스턴스 스토어 정의
export const useInstancesStore = defineStore('instances', () => {
  const instances = ref<Instance[]>([]) // 인스턴스 데이터들을 담을 배열
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
      const response = await instanceAPI.fetchInstances()
      // 배열이 아닌 다른 형식이 반환되어 타입 에러가 발생하는 것을 방지함
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
      const response = await instanceAPI.fetchInstance(instanceId)
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
      let privateIp: Instance['privateIp'] = generatePrivateIp()
      while (instances.value.some((inst) => inst.privateIp === privateIp)) {
        // 중복 시, 새로운 IP 재할당
        privateIp = generatePrivateIp()
      }

      // 외부 IP 할당
      let publicIp: Instance['publicIp']
      if (getNetworkType(data.network) === 'public') {
        publicIp = generatePublicIp()
        while (instances.value.some((inst) => inst.publicIp === publicIp)) {
          publicIp = generatePublicIp()
        }
      }

      // 인스턴스 목록에 추가할 업데이트 데이터
      const instanceData = {
        ...data,
        privateIp,
        publicIp,
      }

      const response = await instanceAPI.fetchCreateInstance(instanceData)
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
      // 네트워크 변경이 있는 경우 IP 처리
      if (data.network) {
        const instance = instances.value.find((inst) => inst.id === instanceId)
        if (instance) {
          const oldNetworkType = getNetworkType(instance.network)
          const newNetworkType = getNetworkType(data.network)

          // 네트워크 타입이 변경되었고, 그게 퍼블릭이라면
          if (oldNetworkType !== newNetworkType) {
            if (newNetworkType === 'public') {
              // 외부 IP 할당
              let publicIp = generatePublicIp()
              while (instances.value.some((inst) => inst.publicIp === publicIp)) {
                // 외부 IP 재할당
                publicIp = generatePublicIp()
              }
              data.publicIp = publicIp
            } else {
              // public -> private이라면, 외부 IP 제거
              data.publicIp = undefined
            }
          }
        }
      }

      const response = await instanceAPI.fetchUpdateInstance(instanceId, data)
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      // 인스턴스 배열 업데이트
      if (index !== -1) {
        instances.value = [
          // 업데이트할 인스턴스 이전까지의 데이터들
          ...instances.value.slice(0, index),
          // 새로 업데이트할 인스턴스 데이터
          response.data,
          // 업데이트할 인스턴스 이후의 데이터들
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
      await instanceAPI.fetchDeleteInstance(instanceId)
      instances.value = instances.value.filter((inst) => inst.id !== instanceId)
    } catch (err) {
      console.error('인스턴스 삭제 실패:', err)
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  // 인스턴스 전원 토글 (목록 화면에서 제어시 사용)
  const toggleInstancePower = async (instanceId: string) => {
    const instance = instances.value.find((inst) => inst.id === instanceId)
    if (!instance) throw new Error(`인스턴스를 찾을 수 없습니다: ${instanceId}`)

    isTogglingPower.value = true
    try {
      const newPowerState = !instance.powerOn
      const response = await instanceAPI.fetchToggleInstancePower(instanceId, {
        powerOn: newPowerState,
        status: newPowerState ? 'RUNNING' : 'SHUTDOWN',
      })

      // 인스턴스 배열 업데이트
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
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

  // 인스턴스 전원 상태 업데이트 (수정 모달에서 제어시 사용)
  const updatePowerStatus = async (
    instanceId: string,
    data: Pick<Instance, 'powerOn' | 'status'>
  ) => {
    isTogglingPower.value = true
    try {
      const response = await instanceAPI.fetchToggleInstancePower(instanceId, data)
      const index = instances.value.findIndex((inst) => inst.id === instanceId)
      if (index !== -1) {
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
