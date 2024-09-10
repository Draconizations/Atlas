import { Embed, } from "seyfert";
import type { AtlasSystem } from "../types/system";
import type { ColorResolvable } from "seyfert/lib/common";

export function systemEmbed(system: AtlasSystem) {
  let embed = new Embed({
    title: system.name ?? "Unnamed system",
  })

  if (system.color) embed = embed.setColor(`#${system.color}` as ColorResolvable)
  if (system.icon) embed = embed.setThumbnail(system.icon)

  return embed
}