import type { Flavor } from '../types/flavor'
import { mockFlavors } from '../data/flavors'
import { delay, DELAY_TIMES } from '../utils/delay'

// 모든 Flavor 조회
export const getFlavors = async (): Promise<Flavor[]> => {
  await delay(DELAY_TIMES.NORMAL)
  return [...mockFlavors]
}

// Flavor name으로 상세 조회(조회 후, 플레이버 상세 정보 반환) - 인스턴스 생성 및 수정시
export const getFlavorByName = async (name: string): Promise<Flavor | null> => {
  await delay(DELAY_TIMES.FAST)
  return mockFlavors.find((flavor) => flavor.name === name) || null
}

// Flavor 검증(해당 Flavor 존재 여부만 확인) - 인스턴스 생성시
export const validateFlavor = async (flavorName: string): Promise<boolean> => {
  await delay(DELAY_TIMES.FAST)
  return mockFlavors.some((flavor) => flavor.name === flavorName)
}
