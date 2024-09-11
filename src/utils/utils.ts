import type { CommandContext, Guild, ReturnCache } from "seyfert"

export function isUrl(url: string) {
	try {
		new URL(url)
	} catch (e) {
		return false
	}
	return true
}

export function nullIfEmpty(value: string | null | undefined) {
	if (value && value.length === 0) return null
	else if (value === "/clear" || value === "{clear}") return null
	else return value?.replaceAll("\\n", "\n")
}

export function checkGuildInstall(ctx: CommandContext) {
	if (
		ctx.interaction.context === 0 &&
		!ctx.interaction.authorizingIntegrationOwners["0" as keyof {}]
	)
		return false
	else return true
}
