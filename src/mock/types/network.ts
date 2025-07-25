export interface Network {
  name: string
  type: 'private' | 'public'
  description: string
}

export type NetworksResponse = Network[]
