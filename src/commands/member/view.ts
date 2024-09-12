import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { memberViewOptions } from "../../options/member"
import { getSystemByAccount } from "../../db/system"
import { AtlasError, writeError } from "../../utils/errors"
import { getMemberByName } from "../../db/member"
import { MemberEmbed } from "../../utils/embed"

@Declare({
	name: "view",
	description: "Shows a member's info.",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Middlewares(["data", "guild"])
@Options(memberViewOptions)
export class ViewMemberCommand extends SubCommand {
	async run(ctx: CommandContext<typeof memberViewOptions, "data">) {
		let system = ctx.metadata.data.system

		if (ctx.options.user) {
			system = await getSystemByAccount(ctx.options.user.id)
		}

		if (!system) {
			if (ctx.options.user) {
				await writeError(ctx, AtlasError.other_system_missing)
			} else {
				await ctx.write({
					content:
						"❌ You do not have a system registered. Did you mean to view another user's member?",
				})
			}
			return
		}

		const member = await getMemberByName(system.id, ctx.options.member)

		if (!member) {
			await ctx.write({
				content: `❌ Member with name or alias "${ctx.options.member}" not found.`,
			})
			return
		}

		await ctx.write({
			content: `Viewing ${member.name} ${system.name ? `(${system.name})` : ""}`,
			embeds: [MemberEmbed(ctx, member, system)],
		})
	}

	async onRunError(context: CommandContext<typeof memberViewOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error viewing member :(",
		})
	}
}
