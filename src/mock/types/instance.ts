// 인스턴스 상세 타입
export interface Instance {
  id: string
  name: string
  image: string
  flavor: string
  cpu: number
  memory: number
  disk: number
  network: string
  status: 'RUNNING' | 'SHUTDOWN'
  privateIp?: string
  publicIp?: string
  createdAt: string
  powerOn: boolean
}

// 인스턴스 목록 타입
export type InstancesResponse = Instance[]

// 생성 요청 타입
export interface CreateInstanceRequest {
  name: string
  image: string
  flavor: string
  network: string
}

// 생성 응답 타입
export interface CreateInstanceResponse {
  id: string
}

// 수정 요청 타입
export interface UpdateInstanceRequest {
  name?: string
  flavor?: string
  image?: string
  network?: string
}

// 전원 상태 요청 타입
export interface PowerUpdateRequest {
  powerOn: boolean
  status: 'RUNNING' | 'SHUTDOWN'
}
