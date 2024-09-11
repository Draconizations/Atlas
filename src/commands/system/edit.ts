import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { mapEditOptions, systemEditOptions } from "../../options/system"
import { AtlasError, writeError } from "../../utils/errors"
import type { AtlasSystem } from "../../types/system"
import { updateSystemById } from "../../db/system"
import { systemEmbed } from "../../utils/embed"
import { checkGuildInstall } from "../../utils/utils"
import { MessageFlags } from "seyfert/lib/types"

@Declare({
	name: "edit",
	description: "Edits your own system",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Options(systemEditOptions)
@Middlewares(["data"])
export class EditSystemCommand extends SubCommand {
	async run(ctx: CommandContext<typeof systemEditOptions, "data">) {
		if (!checkGuildInstall(ctx)) {
			await ctx.write({
				content: `❌ This server does not have Atlas installed.`,
				flags: MessageFlags.Ephemeral,
			})
			return
		}

		const system = ctx.metadata.data.system

		if (!system) {
			await writeError(ctx, AtlasError.system_missing)
			return
		}

		const patch = mapEditOptions(ctx)
		if (Object.values(patch).every((x) => x === undefined)) {
			await writeError(ctx, AtlasError.no_changes)
			return
		}

		let updated: AtlasSystem | null = null
		if (system) {
			updated = await updateSystemById(system.id, patch)
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
