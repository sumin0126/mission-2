import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Instance, CreateInstanceRequest, UpdateInstanceRequest } from '@/mock/types/instance'
import { mockInstances } from '@/mock/data/instances'
import { getFlavorByName, validateFlavor } from '@/mock/api/flavorApi'
import { validateImage } from '@/mock/api/imageApi'
import {
  validateNetwork,
  allocatePrivateIp,
  releasePrivateIp,
  allocatePublicIp,
  releasePublicIp,
} from '@/mock/api/networkApi'
import { delay, DELAY_TIMES } from '@/mock/utils/delay'

export const useInstanceStore = defineStore('instances', () => {
  // 1) 상태 (State)
  const instances = ref<Instance[]>([...mockInstances])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 2) 게터 (Getters)
  const totalInstances = computed(() => instances.value.length)
  const runningInstances = computed(() =>
    instances.value.filter((instance) => instance.status === 'RUNNING')
  )
  const shutdownInstances = computed(() =>
    instances.value.filter((instance) => instance.status === 'SHUTDOWN')
  )

  // 3) 액션 (action)
  // 인스턴스 목록 조회
  const getInstances = async (): Promise<Instance[]> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.NORMAL)

      return [...instances.value]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 상세 조회
  const getInstanceById = async (id: string): Promise<Instance> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.FAST)

      const instance = instances.value.find((inst) => inst.id === id)
      if (!instance) {
        throw new Error(`Instance with id ${id} not found`)
      }

      return instance
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 인스턴스 생성
  const createInstance = async (data: CreateInstanceRequest): Promise<Instance> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.SLOW)

      // 검증
      const [isValidFlavor, isValidImage, isValidNetwork] = await Promise.all([
        validateFlavor(data.flavor),
        validateImage(data.image),
        validateNetwork(data.network),
      ])

      if (!isValidFlavor) throw new Error(`Invalid flavor: ${data.flavor}`)
      if (!isValidImage) throw new Error(`Invalid image: ${data.image}`)
      if (!isValidNetwork) throw new Error(`Invalid network: ${data.network}`)

      // Flavor 정보 조회
      const flavor = await getFlavorByName(data.flavor)
      if (!flavor) throw new Error(`Flavor not found: ${data.flavor}`)

      // IP 할당
      const [privateIp, publicIp] = await Promise.all([
        allocatePrivateIp(data.network),
        allocatePublicIp(data.network),
      ])

      const newInstance: Instance = {
        id: `inst-${Date.now()}`,
        name: data.name,
        status: 'SHUTDOWN',
        flavor: data.flavor,
        image: data.image,
        network: data.network,
        cpu: flavor.cpu,
        memory: flavor.memory,
        disk: flavor.disk,
        privateIp,
        powerOn: false,
        createdAt: new Date().toISOString(),
      }

      // 조건부로 publicIp 추가
      if (publicIp) {
        newInstance.publicIp = publicIp
      }

      instances.value.push(newInstance)
      return newInstance
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 인스턴스 수정
  const updateInstance = async (id: string, data: UpdateInstanceRequest): Promise<Instance> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.NORMAL)

      const instanceIndex = instances.value.findIndex((inst) => inst.id === id)
      if (instanceIndex === -1) {
        throw new Error(`Instance with id ${id} not found`)
      }

      let modifiedInstance = { ...instances.value[instanceIndex] }

      // 이름 수정
      if (data.name) {
        modifiedInstance.name = data.name
      }

      // Flavor 변경
      if (data.flavor) {
        const isValidFlavor = await validateFlavor(data.flavor)
        if (!isValidFlavor) throw new Error(`Invalid flavor: ${data.flavor}`)

        const flavor = await getFlavorByName(data.flavor)
        if (!flavor) throw new Error(`Flavor not found: ${data.flavor}`)

        modifiedInstance.flavor = data.flavor
        modifiedInstance.cpu = flavor.cpu
        modifiedInstance.memory = flavor.memory
        modifiedInstance.disk = flavor.disk
      }

      // Image 변경
      if (data.image) {
        const isValidImage = await validateImage(data.image)
        if (!isValidImage) throw new Error(`Invalid image: ${data.image}`)
        modifiedInstance.image = data.image
      }

      // Network 변경
      if (data.network) {
        const isValidNetwork = await validateNetwork(data.network)
        if (!isValidNetwork) throw new Error(`Invalid network: ${data.network}`)

        // 기존 IP 해제
        // 내부 IP 해제
        await releasePrivateIp(modifiedInstance.network, modifiedInstance.privateIp)
        // 외부 IP 해제
        if (modifiedInstance.publicIp) {
          await releasePublicIp(modifiedInstance.network, modifiedInstance.publicIp)
        }

        // 새 IP 할당
        const [newPrivateIp, newPublicIp] = await Promise.all([
          allocatePrivateIp(data.network),
          allocatePublicIp(data.network),
        ])

        modifiedInstance.network = data.network
        modifiedInstance.privateIp = newPrivateIp
        if (newPublicIp) {
          modifiedInstance.publicIp = newPublicIp
        } else {
          delete modifiedInstance.publicIp
        }
      }

      instances.value[instanceIndex] = modifiedInstance
      return modifiedInstance
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 인스턴스 삭제
  const deleteInstance = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.FAST)

      const instanceIndex = instances.value.findIndex((inst) => inst.id === id)
      if (instanceIndex === -1) {
        throw new Error(`Instance with id ${id} not found`)
      }

      const instance = instances.value[instanceIndex]

      // 기존 IP 해제
      // 내부 IP 해제
      await releasePrivateIp(instance.network, instance.privateIp)
      // 외부 IP 해제
      if (instance.publicIp) {
        await releasePublicIp(instance.network, instance.publicIp)
      }

      instances.value.splice(instanceIndex, 1)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 인스턴스 다중 삭제
  const bulkDeleteInstances = async (ids: string[]): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.VERY_SLOW)

      // 삭제할 인스턴스들 찾기
      const instancesToDelete = instances.value.filter((item) => ids.includes(item.id))

      // 각 인스턴스의 IP 해제
      for (const targetInstance of instancesToDelete) {
        // 내부 IP 해제
        await releasePrivateIp(targetInstance.network, targetInstance.privateIp)
        // 외부 IP 해제
        if (targetInstance.publicIp) {
          await releasePublicIp(targetInstance.network, targetInstance.publicIp)
        }
      }

      // 인스턴스 목록에서 제거
      instances.value = instances.value.filter((item) => !ids.includes(item.id))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 전원 토글
  const toggleInstancePower = async (id: string): Promise<Instance> => {
    loading.value = true
    error.value = null

    try {
      await delay(DELAY_TIMES.POWER_TOGGLE)

      const instanceIndex = instances.value.findIndex((inst) => inst.id === id)
      if (instanceIndex === -1) {
        throw new Error(`Instance with id ${id} not found`)
      }

      const currentInstance = instances.value[instanceIndex]
      const newPowerState = !currentInstance.powerOn

      const updatedInstance = {
        ...currentInstance,
        powerOn: newPowerState,
        status: newPowerState ? ('RUNNING' as const) : ('SHUTDOWN' as const),
      }

      instances.value[instanceIndex] = updatedInstance
      return updatedInstance
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 에러 상태 초기화
  const clearError = () => {
    error.value = null
  }

  return {
    // 상태
    instances,
    loading,
    error,

    // 게터
    totalInstances,
    runningInstances,
    shutdownInstances,

    // 액션
    getInstances,
    getInstanceById,
    createInstance,
    updateInstance,
    deleteInstance,
    toggleInstancePower,
    bulkDeleteInstances,
    clearError,
  }
})
