export interface Network {
  name: string
  type: 'private' | 'public'
  description: string
}

export type NetworksResponse = Network[]

// 네트워크별 IP 할당을 위한 관리 인터페이스
export interface NetworkIpAllocation {
  networkName: string
  // 내부 IP 관리 (private / public 네트워크 둘다 해당)
  allocatedPrivateIps: string[] // 이미 사용중안 내부 IP 목록
  privateIpRange: {
    start: string
    end: string
  }
  // 외부 IP 관리 (Public 네트워크만)
  availablePublicIps?: string[] // 사용 가능한 외부 IP 목록
  allocatedPublicIps?: string[] // 이미 사용중인 외부 IP 목록
}
