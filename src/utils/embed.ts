import { CommandContext, Embed } from "seyfert"
import type { AtlasSystem } from "../types/system"
import type { ColorResolvable } from "seyfert/lib/common"
import type { systemViewOptions } from "../options/system"
import type { aliasOptions, memberViewOptions } from "../options/member"
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

	let rawAliasText = member.aliases?.map((a) => a.name).join("​, ") ?? ""

	let aliasText = rawAliasText
	if (rawAliasText.length > 150) {
		const index = rawAliasText.indexOf("​, ", 140)
		const extra = rawAliasText.slice(index + 3).split("​, ").length
		aliasText = rawAliasText.slice(0, index) + `, \`+ ${extra} more\``
	}

	if (member.aliases && member.aliases.length > 0)
		embed.addFields({
			name: "Aliases",
			value: aliasText,
			inline: true,
		})

	const user = ctx.options.user ? ctx.options.user : ctx.author

	embed.setFooter({
		text: `${system.name ? `${system.name} (@${user.username}) | ` : `@${user.username} | `}Created on ${member.created?.toLocaleDateString(
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
		text: `Sent by @${ctx.author.username} | ${member.name}${system.name ? ` (${system.name})` : ""}`,
	})

	return embed
}

export function aliasEmbed(
	ctx: CommandContext<typeof aliasOptions, "guild">,
	member: AtlasMember,
	system: AtlasSystem
) {
	let embed = new Embed({
		title: `Member aliases`,
		description: `\nThese are the current aliases belonging to ${member.name}.
To add an alias, use \`/member alias add:alias\`
To remove an alias, use \`/member alias remove:alias\``,
	})
	let rawText = member.aliases?.map((a) => a.name).join("​, ") ?? ""
	if (!rawText) rawText = "This member does not have any aliases."

	let text = rawText
	if (rawText.length > 1000) {
		const index = rawText.indexOf("​, ", 990)
		const extra = rawText.slice(index + 3).split("​, ").length
		text = rawText.slice(0, index) + `, \`+ ${extra} more\``
		text = rawText.slice(0, index) + "..."
	}

	embed.setAuthor({
		name: `${member.name ?? "Unknown Member"}${system.name ? ` (${system.name})` : ""}`,
		iconUrl: member.icon ?? undefined,
	})

	embed.addFields([
		{
			name: "Aliases",
			value: text,
		},
	])

	if (member.color) embed.setColor(`#${member.color}`)

	let footer = `${system.name ? `${system.name} (@${ctx.author.username})` : `@${ctx.author.username}`}`
	if (rawText.length > 1000) footer += ` | alias list has been truncated`
	embed.setFooter({
		text: footer,
	})

	return embed
}
