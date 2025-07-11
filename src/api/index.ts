import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'

const create = (options?: CreateAxiosDefaults): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT),
    ...options,
  })

  // 개발 편의를 위한 요청/응답 로깅
  instance.interceptors.request.use(async (config) => {
    console.log('API Request:', config)
    return config
  })

  return instance
}

// Mock API 인스턴스 생성
export const instancesAxios = create()
