import { CommandContext, Embed, } from "seyfert";
import type { AtlasSystem } from "../types/system";
import type { ColorResolvable } from "seyfert/lib/common";
import type { systemViewOptions } from "../options/system";

export function systemEmbed(ctx: CommandContext<typeof systemViewOptions>, system: AtlasSystem) {
  let embed = new Embed({
    title: system.name ?? `${ctx.options?.user ? ctx.options.user.username : ctx.author.username}'s system`,
  })

  if (system.color) embed = embed.setColor(`#${system.color}` as ColorResolvable)
  if (system.icon) embed = embed.setThumbnail(system.icon)
  if (system.description) embed.setDescription(system.description)

  embed.addFields({
    name: "Linked accounts",
    value: system.accounts ? system.accounts.map(a => `<@${a.id}>`).join(", ") : "n/a"
  })

  embed.setFooter({
    text: `Created on ${system.created?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`
  })

  return embed
}