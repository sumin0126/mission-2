import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  const startLoading = (): void => {
    isLoading.value = true
  }

  const stopLoading = (): void => {
    isLoading.value = false
  }

  // TODO : 로딩 지연 시키는 CRUD 작업들 중에 withLoading 함수 전부 다 사용중인지 확인하기
  const withLoading = async <T>(
    operation: () => Promise<T>,
    minDelay: number = 500,
    maxDelay: number = 2000
  ): Promise<T> => {
    startLoading()

    try {
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
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
    startLoading,
    stopLoading,
    withLoading,
  }
})
