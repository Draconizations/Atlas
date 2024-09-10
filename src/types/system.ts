export interface AtlasSystem {
  name?: string|null,
  color?: string|null,
  icon?: string|null
}

export interface AtlasSystemInternal extends AtlasSystem {
  id: number
}