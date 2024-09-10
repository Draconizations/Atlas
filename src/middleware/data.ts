import { createMiddleware } from "seyfert";
import type { AtlasSystemInternal } from "../types/system";
import { getSystemByAccount } from "../db/system";

interface AtlasData {
  system: AtlasSystemInternal|null
}

export const AtlasDataMiddleWare = createMiddleware<AtlasData>(async (middle) => {
  const system = await getSystemByAccount(middle.context.author.id)
  middle.next({
    system
  })
})