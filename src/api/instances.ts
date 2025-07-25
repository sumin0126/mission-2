import type {
  Instance,
  CreateInstanceRequest,
  UpdateInstanceRequest,
  PowerUpdateRequest,
} from '@/mock/types/instance'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import { instancesAxios } from './index'

// 로컬 스토리지 키
const INSTANCES_STORAGE_KEY = 'instances'

// 로컬 스토리지에서 인스턴스 데이터 가져오기
const getStoredInstances = () => {
  const stored = localStorage.getItem(INSTANCES_STORAGE_KEY)
  return stored ? (JSON.parse(stored) as Instance[]) : []
}

// 로컬 스토리지에 인스턴스 데이터 저장
const setStoredInstances = (instances: Instance[]) => {
  localStorage.setItem(INSTANCES_STORAGE_KEY, JSON.stringify(instances))
}

// 인스턴스 목록 조회
export const fetchInstances = async () => {
  const stored = getStoredInstances()
  if (stored.length > 0) {
    return {
      data: stored,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as AxiosRequestConfig,
    } as AxiosResponse<Instance[]>
  }

  const response = await instancesAxios.get<{ instances: Instance[] }>('/instances.json')
  const instances = response.data.instances
  setStoredInstances(instances)
  return {
    data: instances,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<Instance[]>
}

// 인스턴스 단일 조회
export const fetchInstance = async (id: string) => {
  const instances = getStoredInstances()
  const instance = instances.find((i) => i.id === id)
  if (!instance) {
    return Promise.reject(new Error('Instance not found'))
  }
  return {
    data: instance,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<Instance>
}

// 인스턴스 생성
export const fetchCreateInstance = async (data: CreateInstanceRequest) => {
  const instances = getStoredInstances()
  const newInstance: Instance = {
    ...data,
    id: `i-${Date.now()}`,
    status: 'RUNNING',
    createdAt: new Date().toISOString(),
  }
  instances.push(newInstance)
  setStoredInstances(instances)
  return {
    data: newInstance,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<Instance>
}

// 인스턴스 수정
export const fetchUpdateInstance = async (
  id: string,
  data: UpdateInstanceRequest | PowerUpdateRequest
) => {
  const instances = getStoredInstances()
  const index = instances.findIndex((i) => i.id === id)
  if (index === -1) {
    return Promise.reject(new Error('Instance not found'))
  }

  const updatedInstance: Instance = {
    ...instances[index],
    ...data,
  }
  instances[index] = updatedInstance
  setStoredInstances(instances)
  return {
    data: updatedInstance,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<Instance>
}

// 인스턴스 삭제
export const fetchDeleteInstance = async (id: string) => {
  const instances = getStoredInstances()
  const filtered = instances.filter((i) => i.id !== id)
  setStoredInstances(filtered)
  return {
    data: undefined,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig,
  } as AxiosResponse<void>
}

// 인스턴스 전원 제어
export const fetchToggleInstancePower = (id: string, data: PowerUpdateRequest) => {
  return fetchUpdateInstance(id, data)
}
