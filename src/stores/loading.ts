import { defineStore } from 'pinia'
import { ref } from 'vue'

// 로딩 지연 시간 상수 정의
const MIN_DELAY = 500
const MAX_DELAY = 2000

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  const startLoading = (): void => {
    isLoading.value = true
  }

  const stopLoading = (): void => {
    isLoading.value = false
  }

  // TODO : 로딩 지연 시간은 CRUD 작업들 중에 withLoading 함수 전부 다 사용중인지 확인하기
  const withLoading = async <T>(operation: () => Promise<T>): Promise<T> => {
    startLoading()

    try {
      const randomDelay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY
      // 먼저 지연 실행
      await new Promise((resolve) => setTimeout(resolve, randomDelay))
      // 그 다음 operation 실행
      return await operation()
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    withLoading,
  }
})
