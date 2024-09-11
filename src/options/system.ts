import { CommandContext, createStringOption, createUserOption, type OKFunction } from "seyfert"
import { isUrl, parseStringInput } from "../utils/utils"
import type { AtlasSystem } from "../types/system"

export const systemEditOptions = {
	name: createStringOption({
		description: "Sets a system name",
		max_length: 100,
		required: false,
	}),
	color: createStringOption({
		description: "Sets a decorative system color",
		max_length: 7,
		required: false,
		value(data, ok: OKFunction<string>, fail) {
			if (data.value.length === 0) return ok("")
			const match = data.value.match(/^#?([0-9a-fA-F]{6})$/)
			if (match && match[1]) return ok(match[1])
			fail("Expected a valid hex color (i.e. #aabbcc)")
		},
	}),
	icon: createStringOption({
		description: "Sets a system icon with the given URL",
		required: false,
		value(data, ok: OKFunction<URL>, fail) {
			if (isUrl(data.value)) return ok(new URL(data.value))
			fail("expected a valid url")
		},
	}),
	description: createStringOption({
		description: "Sets a system description",
		required: false,
		max_length: 4000,
	}),
}

export function mapEditOptions(ctx: CommandContext<typeof systemEditOptions>) {
	const data: AtlasSystem = {
		name: parseStringInput(ctx.options.name),
		color: parseStringInput(ctx.options.color),
		icon: parseStringInput(ctx.options.icon?.toString()),
		description: parseStringInput(ctx.options.description),
	}

	return data
}

export const systemViewOptions = {
	user: createUserOption({
		required: false,
		description: "Shows a system belonging to a specific user.",
	}),
}
