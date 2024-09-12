import { Command, CommandContext, Declare, Middlewares, Options } from "seyfert"
import { AtlasError, writeError } from "../utils/errors"
import { getMemberByName } from "../db/member"
import { MessageFlags } from "seyfert/lib/types"
import { proxyOptions } from "../options/proxy"
import { proxyEmbed } from "../utils/embed"

@Declare({
	name: "proxy",
	aliases: ["send", "message"],
	description: "Sends a message as a member",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Options(proxyOptions)
@Middlewares(["data", "guild"])
export default class ProxyCommand extends Command {
	async run(ctx: CommandContext<typeof proxyOptions, "data">) {
		const system = ctx.metadata.data.system

		if (!system) {
			await writeError(ctx, AtlasError.system_missing, true)
			return
		}

		const member = await getMemberByName(system.id, ctx.options.member)

		if (!member) {
			await ctx.write({
				content: `❌ Member with name or alias "${ctx.options.member}" not found.`,
				flags: MessageFlags.Ephemeral,
			})
			return
		}

		await ctx.write({
			embeds: [proxyEmbed(ctx, member, system)],
		})
	}

	async onRunError(context: CommandContext<typeof proxyOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Could not send message for unknown reasons :(",
			flags: MessageFlags.Ephemeral,
		})
	}
}
