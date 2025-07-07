import type { Network } from '../types/network'
import { mockNetworks, mockNetworkAllocations } from '../data/networks'
import { delay, DELAY_TIMES } from '../utils/delay'

// 모든 Network 조회
export const getNetworks = async (): Promise<Network[]> => {
  await delay(DELAY_TIMES.FAST)
  return [...mockNetworks]
}

// Network name으로 상세 조회
export const getNetworkByName = async (name: string): Promise<Network | null> => {
  await delay(DELAY_TIMES.FAST)
  return mockNetworks.find((network) => network.name === name) || null
}

// Network 검증 (인스턴스 생성 시 사용)
export const validateNetwork = async (networkName: string): Promise<boolean> => {
  await delay(DELAY_TIMES.FAST)
  return mockNetworks.some((network) => network.name === networkName)
}

// 내부 IP 자동 할당
export const allocatePrivateIp = async (networkName: string): Promise<string> => {
  await delay(DELAY_TIMES.IP_ALLOCATION)

  // network : private or public
  const network = mockNetworks.find((n) => n.name === networkName)
  if (!network) {
    throw new Error(`${networkName}를 찾을 수 없습니다.`)
  }

  // allocation : 각 네트워크의 IP 할당 정보를 담은 객체
  const allocation = mockNetworkAllocations.find(
    (allocationInfo) => allocationInfo.networkName === networkName
  )
  if (!allocation) {
    throw new Error(`네트워크 IP 할당 정보를 찾을 수 없습니다: ${networkName}`)
  }

  // 사용가능한 IP 범위 추출
  // baseIp : IP 주소의 공통 부분
  // startOctet : IP 시작 번호
  // endOctet : IP 끝 번호
  const baseIp = allocation.privateIpRange.start.split('.').slice(0, 3).join('.')
  const startOctet = parseInt(allocation.privateIpRange.start.split('.')[3])
  const endOctet = parseInt(allocation.privateIpRange.end.split('.')[3])

  // 사용 가능한 IP 찾기
  // startOctet부터 시작해서, endOctet까지만 반복함
  for (let i = startOctet; i <= endOctet; i++) {
    const candidateIp = `${baseIp}.${i}`
    if (!allocation.allocatedPrivateIps.includes(candidateIp)) {
      // IP 할당 기록
      allocation.allocatedPrivateIps.push(candidateIp)
      return candidateIp
    }
  }

  throw new Error(`${networkName} 네트워크에서 사용 가능한 IP 주소가 없습니다`)
}

// 내부 IP 해제
export const releasePrivateIp = async (networkName: string, ipAddress: string): Promise<void> => {
  await delay(DELAY_TIMES.FAST)

  const allocation = mockNetworkAllocations.find(
    (allocationInfo) => allocationInfo.networkName === networkName
  )
  if (!allocation) {
    throw new Error(`네트워크 IP 할당 정보를 찾을 수 없습니다: ${networkName}`)
  }

  // IP 해제
  const index = allocation.allocatedPrivateIps.indexOf(ipAddress)
  if (index > -1) {
    allocation.allocatedPrivateIps.splice(index, 1)
  }
}

// 외부 IP 자동 할당 (Public 네트워크용)
export const allocatePublicIp = async (networkName: string): Promise<string | null> => {
  await delay(DELAY_TIMES.IP_ALLOCATION)

  const network = mockNetworks.find((n) => n.name === networkName)
  if (!network || network.type !== 'public') {
    return null // Private 네트워크는 외부 IP 없음
  }

  const allocation = mockNetworkAllocations.find(
    (allocationInfo) => allocationInfo.networkName === networkName
  )
  if (!allocation || !allocation.availablePublicIps) {
    throw new Error(`${networkName} 네트워크의 외부 IP 풀을 찾을 수 없습니다`)
  }

  // 사용 가능한 외부 IP 찾기
  for (const ip of allocation.availablePublicIps) {
    if (!allocation.allocatedPublicIps?.includes(ip)) {
      // 외부 IP 할당 기록 조회
      if (!allocation.allocatedPublicIps) {
        allocation.allocatedPublicIps = []
      }
      // 사용 가능한 IP 할당
      allocation.allocatedPublicIps.push(ip)
      return ip
    }
  }

  throw new Error(`${networkName} 네트워크에서 사용 가능한 외부 IP 주소가 없습니다`)
}

// 외부 IP 해제
export const releasePublicIp = async (networkName: string, publicIp: string): Promise<void> => {
  await delay(DELAY_TIMES.FAST)

  const allocation = mockNetworkAllocations.find(
    (allocationInfo) => allocationInfo.networkName === networkName
  )
  if (!allocation || !allocation.allocatedPublicIps) {
    return // 해제할 IP가 없음
  }

  // 외부 IP 해제
  const index = allocation.allocatedPublicIps.indexOf(publicIp)
  if (index > -1) {
    allocation.allocatedPublicIps.splice(index, 1)
  }
}
