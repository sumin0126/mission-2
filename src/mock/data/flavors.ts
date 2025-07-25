import type { Flavor } from '../types/flavor'

export const mockFlavors: Flavor[] = [
  {
    name: 'C1M2D20',
    description: 'instance.flavor.c1m2d20',
    cpu: 1,
    memory: 2,
    disk: 20,
  },
  {
    name: 'C2M4D40',
    description: 'instance.flavor.c2m4d40',
    cpu: 2,
    memory: 4,
    disk: 40,
  },
  {
    name: 'C4M8D80',
    description: 'instance.flavor.c4m8d80',
    cpu: 4,
    memory: 8,
    disk: 80,
  },
  {
    name: 'C8M16D160',
    description: 'instance.flavor.c8m16d160',
    cpu: 8,
    memory: 16,
    disk: 160,
  },
]
