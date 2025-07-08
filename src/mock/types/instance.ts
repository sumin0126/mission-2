// 인스턴스 타입
export interface Instance {
  id: string
  name: string
  status: 'RUNNING' | 'SHUTDOWN'
  flavor: string // "C1M2D20"
  image: string // "ubuntu-2204-kube-v1.31.10"
  network: string // "private-network"
  cpu: number
  memory: number
  disk: number
  privateIp: string // 내부 IP (항상 존재)
  publicIp?: string // 외부 IP (Public 네트워크만)
  powerOn: boolean // 전원 토글 상태
  createdAt: string
}

// API 응답 타입
export interface InstancesResponse {
  instances: Instance[]
}

// 생성 타입
export interface CreateInstanceRequest {
  name: string
  flavor: string
  image: string
  network: string
}

// 수정 타입
export interface UpdateInstanceRequest {
  name?: string
  flavor?: string
  image?: string
  network?: string
}

// 전원 상태 업데이트 타입
export interface PowerUpdateRequest {
  powerOn: boolean
  status: 'RUNNING' | 'SHUTDOWN'
}
