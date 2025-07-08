import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'

const create = (baseURL: string, options?: CreateAxiosDefaults): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    ...options,
  })
  return instance
}

// json-server 엔드포인트를 생성
export const instancesAxios = create('http://localhost:3000')
