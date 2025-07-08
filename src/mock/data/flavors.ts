import type { Flavor } from '../types/flavor'

export const mockFlavors: Flavor[] = [
  {
    name: 'C1M2D20',
    description: 'CPU 1코어 · 메모리 2GB · 디스크 20GB',
    cpu: 1,
    memory: 2,
    disk: 20,
  },
  {
    name: 'C2M4D40',
    description: 'CPU 2코어 · 메모리 4GB · 디스크 40GB',
    cpu: 2,
    memory: 4,
    disk: 40,
  },
  {
    name: 'C4M8D80',
    description: 'CPU 4코어 · 메모리 8GB · 디스크 80GB',
    cpu: 4,
    memory: 8,
    disk: 80,
  },
  {
    name: 'C8M16D160',
    description: 'CPU 8코어 · 메모리 16GB · 디스크 160GB',
    cpu: 8,
    memory: 16,
    disk: 160,
  },
]
