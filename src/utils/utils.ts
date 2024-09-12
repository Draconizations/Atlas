import type { CommandContext, Guild, ReturnCache } from "seyfert"

export function isUrl(url: string) {
	try {
		new URL(url)
	} catch (e) {
		return false
	}
	return true
}

export function parseStringInput(value: string | null | undefined) {
	if (value === "/clear" || value === "{clear}") return null
	else return value?.replaceAll("\\n", "\n")
}
