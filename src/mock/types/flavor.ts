export interface Flavor {
  name: string // "C1M2D20" (식별자로 사용)
  description: string // "CPU 1코어 • 메모리 2GB • 디스크 20GB"
  cpu: number
  memory: number
  disk: number
}
