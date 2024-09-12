import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { systemViewOptions } from "../../options/system"
import type { AtlasSystem } from "../../types/system"
import { getSystemByAccount } from "../../db/system"
import { AtlasError, writeError } from "../../utils/errors"
import { systemEmbed } from "../../utils/embed"

@Declare({
	name: "view",
	description: "Shows a system's info.",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Middlewares(["data", "guild"])
@Options(systemViewOptions)
export class ViewSystemCommand extends SubCommand {
	async run(ctx: CommandContext<typeof systemViewOptions, "data">) {
		let system: AtlasSystem | null = null
		if (!ctx.options.user) system = ctx.metadata.data.system
		else system = await getSystemByAccount(ctx.options.user.id)

		if (!system) {
			if (!ctx.options.user) await writeError(ctx, AtlasError.system_missing)
			else await writeError(ctx, AtlasError.other_system_missing)
			return
		}

		await ctx.write({
			content: `Viewing ${ctx.options.user ? ctx.options.user.username : ctx.author.username}'s system`,
			embeds: [systemEmbed(ctx, system)],
		})
	}

	async onRunError(context: CommandContext<typeof systemViewOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error viewing system :(",
		})
	}
}
