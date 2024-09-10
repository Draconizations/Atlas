import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { mapEditOptions, systemEditOptions } from "../../options/system"
import { AtlasError, writeError } from "../../utils/errors"
import type { AtlasSystem } from "../../types/system"
import { updateSystemById } from "../../db/system"
import { systemEmbed } from "../../utils/embed"

@Declare({
	name: "edit",
	description: "Edits your own system",
})
@Options(systemEditOptions)
@Middlewares(["data"])
export class EditSystemCommand extends SubCommand {
	async run(ctx: CommandContext<typeof systemEditOptions, "data">) {
		const system = ctx.metadata.data.system

		if (!system) {
			await writeError(ctx, AtlasError.system_missing)
			return
		}

		let updated: AtlasSystem | null = null
		if (system) {
			updated = await updateSystemById(system.id, mapEditOptions(ctx))
		}

		await ctx.write({
			content: "Successfully edited system!",
			embeds: updated ? [systemEmbed(ctx, updated)] : undefined,
		})
	}

	async onRunError(context: CommandContext<typeof systemEditOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error editing system :(",
		})
	}
}
