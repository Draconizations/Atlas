import { CommandContext, createStringOption, createUserOption, type OKFunction } from "seyfert"
import { isUrl, nullIfEmpty } from "../utils/utils"
import type { AtlasMember, AtlasMemberFull } from "../types/member"

const memberOptions = {
	color: createStringOption({
		description: "Sets a decorative member color",
		max_length: 7,
		min_length: 6,
		required: false,
		value(data, ok: OKFunction<string>, fail) {
			const match = data.value.match(/^#?([0-9a-fA-F]{6})$/)
			if (match && match[1]) return ok(match[1])
			fail("Expected a valid hex color (i.e. #aabbcc)")
		},
	}),
	icon: createStringOption({
		description: "Sets a member icon with the given URL",
		required: false,
		value(data, ok: OKFunction<URL>, fail) {
			if (isUrl(data.value)) return ok(new URL(data.value))
			fail("expected a valid url")
		},
	}),
	description: createStringOption({
		description: "Sets a member description",
		required: false,
		max_length: 2000,
	}),
	displayname: createStringOption({
		description: "Sets a member display name",
		required: false,
		max_length: 80,
	}),
	pronouns: createStringOption({
		description: "Sets the pronouns for the member.",
		required: false,
		max_length: 200,
	}),
}

export const memberCreateOptions = {
	...{
		name: createStringOption({
			description: "Sets the member name",
			max_length: 100,
			required: true,
		}),
	},
	...memberOptions,
}

export const memberEditOptions = {
	...{
		member: createStringOption({
			description: "The name or alias of the member you're editing.",
			required: true,
			max_length: 100,
		}),
		name: createStringOption({
			description: "Sets the member name",
			max_length: 100,
			required: false,
		}),
	},
	...memberOptions,
}

export function mapEditOptions(ctx: CommandContext<typeof memberEditOptions>) {
	const data: AtlasMember = {
		name: nullIfEmpty(ctx.options.name) ?? undefined,
		color: nullIfEmpty(ctx.options.color),
		icon: nullIfEmpty(ctx.options.icon?.toString()),
		description: nullIfEmpty(ctx.options.description),
		pronouns: nullIfEmpty(ctx.options.pronouns),
		displayName: nullIfEmpty(ctx.options.displayname),
	}

	return data
}

export function mapCreateOptions(ctx: CommandContext<typeof memberCreateOptions>, system: number) {
	const data: AtlasMemberFull = {
		name: ctx.options.name,
		color: nullIfEmpty(ctx.options.color),
		icon: nullIfEmpty(ctx.options.icon?.toString()),
		description: nullIfEmpty(ctx.options.description),
		pronouns: nullIfEmpty(ctx.options.pronouns),
		displayName: nullIfEmpty(ctx.options.displayname),
		system,
		aliases: [],
	}

	return data
}

export const memberViewOptions = {
	member: createStringOption({
		required: true,
		description: "The member name or alias.",
	}),
	user: createUserOption({
		required: false,
		description: "Shows a member from the user specified.",
	}),
}
