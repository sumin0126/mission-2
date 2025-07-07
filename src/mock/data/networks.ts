import type { Network, NetworkIpAllocation } from '../types/network'

export const mockNetworks: Network[] = [
  {
    name: 'private-network',
    type: 'private',
  },
  {
    name: 'public-network',
    type: 'public',
  },
]

// 각 네트워크의 IP 할당 현황 관리
export const mockNetworkAllocations: NetworkIpAllocation[] = [
  // 1) 프라이빗 네트워크
  {
    networkName: 'private-network',
    // 이미 사용중인 내부 IP 목록
    allocatedPrivateIps: [
      '172.30.110.82',
      '172.30.110.87',
      '172.30.110.91',
      '172.30.110.95',
      '172.30.110.103',
      '172.30.110.108',
      '172.30.110.112',
      '172.30.110.127',
    ],
    privateIpRange: {
      start: '172.30.110.50',
      end: '172.30.110.250',
    },
  },

  // 2) 퍼블릭 네트워크
  {
    networkName: 'public-network',
    // 이미 사용중인 내부 IP 목록
    allocatedPrivateIps: ['203.0.113.15', '203.0.113.25'],
    privateIpRange: {
      start: '203.0.113.10',
      end: '203.0.113.200',
    },
    // 사용 가능한 외부 IP 목록
    availablePublicIps: [
      '13.125.45.123',
      '13.125.45.124',
      '13.125.45.125',
      '13.125.45.126',
      '13.125.45.127',
    ],
    // 이미 사용중인 외부 IP 목록
    allocatedPublicIps: ['13.125.45.123', '13.125.45.124'],
  },
]
