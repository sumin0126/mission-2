import type { Network } from '../types/network'

export const mockNetworks: Network[] = [
  {
    name: 'private-network',
    type: 'private',
    description: '내부 IP 자동 할당',
  },
  {
    name: 'public-network',
    type: 'public',
    description: '내부/외부 IP 자동 할당',
  },
]
