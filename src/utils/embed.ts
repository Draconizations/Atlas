import { CommandContext, Embed } from "seyfert"
import type { AtlasSystem } from "../types/system"
import type { ColorResolvable } from "seyfert/lib/common"
import type { systemViewOptions } from "../options/system"
import type { memberViewOptions } from "../options/member"
import type { AtlasMember } from "../types/member"
import type { proxyOptions } from "../options/proxy"

export function systemEmbed(ctx: CommandContext<typeof systemViewOptions>, system: AtlasSystem) {
	let embed = new Embed({
		title:
			system.name ??
			`${ctx.options?.user ? ctx.options.user.username : ctx.author.username}'s system`,
	})

	if (system.color) embed.setColor(`#${system.color}` as ColorResolvable)
	if (system.icon) embed.setThumbnail(system.icon)
	if (system.description) embed.setDescription(system.description)

	embed.addFields({
		name: "Linked accounts",
		value: system.accounts ? system.accounts.map((a) => `<@${a.id}>`).join(", ") : "n/a",
		inline: true,
	})

	embed.setFooter({
		text: `Created on ${system.created?.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})}`,
	})

	return embed
}

export function MemberEmbed(
	ctx: CommandContext<typeof memberViewOptions, "data">,
	member: AtlasMember,
	system: AtlasSystem
) {
	let embed = new Embed({
		title: `${member.name} ${system.name ? `(${system.name})` : ""}`,
	})

	if (member.color) embed.setColor(`#${member.color}`)
	if (member.icon) embed.setThumbnail(member.icon)
	if (member.description) embed.setDescription(member.description)

	if (member.displayName)
		embed.addFields({
			name: "Display name",
			value: member.displayName,
			inline: true,
		})

	if (member.pronouns)
		embed.addFields({
			name: "Pronouns",
			value: member.pronouns,
			inline: true,
		})

	if (member.aliases && member.aliases.length > 0)
		embed.addFields({
			name: "Aliases",
			value: member.aliases.join("\n"),
			inline: false,
		})

	const user = ctx.options.user ? ctx.options.user : ctx.author

	embed.setFooter({
		text: `${system.name ? `${system.name} (@${user.username}) | ` : ""}Created on ${member.created?.toLocaleDateString(
			"en-US",
			{
				year: "numeric",
				month: "short",
				day: "numeric",
			}
		)}`,
	})

	return embed
}

export function proxyEmbed(
	ctx: CommandContext<typeof proxyOptions, "data">,
	member: AtlasMember,
	system: AtlasSystem
) {
	let embed = new Embed({
		title: member.displayName ? member.displayName : member.name,
	})

	if (member.icon) embed.setThumbnail(member.icon)
	if (member.color) embed.setColor(`#${member.color}`)

	embed.setDescription(ctx.options.message.replaceAll("\\n", "\n"))

	embed.setFooter({
		text: `Sent by @${ctx.author.username}${system.name ? ` | ${system.name}` : ""}`,
	})

	return embed
}
