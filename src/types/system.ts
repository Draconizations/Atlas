import type { DiscordAccount } from "./account"

export interface AtlasSystem {
  name?: string|null,
  color?: string|null,
  icon?: string|null,
  description?: string|null,
  accounts?: DiscordAccount[],
  created?: Date
}

export interface AtlasSystemInternal extends AtlasSystem {
  id: number
}