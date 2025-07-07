import type { Image } from '../types/image'
import { mockImages } from '../data/images'
import { delay, DELAY_TIMES } from '../utils/delay'

// 모든 Image 조회
export const getImages = async (): Promise<Image[]> => {
  await delay(DELAY_TIMES.NORMAL)
  return [...mockImages]
}

// Image name으로 상세 조회
export const getImageByName = async (name: string): Promise<Image | null> => {
  await delay(DELAY_TIMES.FAST)
  return mockImages.find((image) => image.name === name) || null
}

// Image 검증 (생성 시 사용)
export const validateImage = async (imageName: string): Promise<boolean> => {
  await delay(DELAY_TIMES.FAST)
  return mockImages.some((image) => image.name === imageName)
}
