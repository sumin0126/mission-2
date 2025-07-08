import type {
  Instance,
  CreateInstanceRequest,
  UpdateInstanceRequest,
  PowerUpdateRequest,
} from '@/mock/types/instance'
import type { AxiosResponse } from 'axios'
import { instancesAxios } from './index'

// 인스턴스 목록 조회
export const getInstances = (): Promise<AxiosResponse<Instance[]>> => {
  return instancesAxios.get('/instances')
}

// 인스턴스 단일 조회
export const getInstance = (id: string): Promise<AxiosResponse<Instance>> => {
  return instancesAxios.get(`/instances/${id}`)
}

// 인스턴스 생성
export const createInstance = (data: CreateInstanceRequest): Promise<AxiosResponse<Instance>> => {
  return instancesAxios.post('/instances', data)
}

// 인스턴스 수정
export const updateInstance = (
  id: string,
  data: UpdateInstanceRequest
): Promise<AxiosResponse<Instance>> => {
  return instancesAxios.patch(`/instances/${id}`, data)
}

// 인스턴스 삭제
export const deleteInstance = (id: string): Promise<AxiosResponse<void>> => {
  return instancesAxios.delete(`/instances/${id}`)
}

// 인스턴스 전원 제어
export const toggleInstancePower = (
  id: string,
  data: PowerUpdateRequest
): Promise<AxiosResponse<Instance>> => {
  return instancesAxios.patch(`/instances/${id}`, data)
}
