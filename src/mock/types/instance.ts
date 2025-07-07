// 인스턴스 타입
export interface Instance {
  id: string
  name: string
  status: 'RUNNING' | 'SHUTDOWN'
  flavor: string // Flavor name (예: "C1M2D20")
  image: string // Image name (예: "ubuntu-2204-kube-v1.31.10")
  network: string // Network name (예: "private-network")
  cpu: number
  memory: number
  disk: number
  privateIp: string // 내부 IP (항상 존재)
  publicIp?: string // 외부 IP (Public 네트워크만)
  powerOn: boolean // 전원 토글 상태
  createdAt: string
}

// 생성 타입
export interface CreateInstanceRequest {
  name: string
  flavor: string // Flavor name
  image: string // Image name
  network: string // Network name
}

// 수정 타입
export interface UpdateInstanceRequest {
  name?: string
  flavor?: string // Flavor 변경 가능
  image?: string // Image 변경 가능
  network?: string // Network 변경 가능
}
