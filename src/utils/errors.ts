import type { CommandContext } from "seyfert"
import { MessageFlags } from "seyfert/lib/types"

export enum AtlasError {
	system_missing = "You do not have a system registered. To create one, use `/system create`.",
	other_system_missing = "This account does not have a system registered.",
	no_changes = "Nothing to edit, please specify at least one field to edit.",
}

export async function writeError(ctx: CommandContext, error: AtlasError, ephemeral = false) {
	await ctx.write({
		content: `❌ ${error.toString()}`,
		flags: ephemeral ? MessageFlags.Ephemeral : undefined,
	})
}
