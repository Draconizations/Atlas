import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { MemberEmbed } from "../../utils/embed"
import { mapCreateOptions, memberCreateOptions } from "../../options/member"
import { AtlasError, writeError } from "../../utils/errors"
import { createMember } from "../../db/member"
import { checkGuildInstall } from "../../utils/utils"
import { MessageFlags } from "seyfert/lib/types"

@Declare({
	name: "create",
	description: "Creates a new member",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Options(memberCreateOptions)
@Middlewares(["data"])
export class CreateMemberCommand extends SubCommand {
	async run(ctx: CommandContext<typeof memberCreateOptions, "data">) {
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

		const member = await createMember(mapCreateOptions(ctx, system.id))

		if (member) {
			await ctx.write({
				content: "Successfully created new member!",
				embeds: [MemberEmbed(ctx as any, member, system)],
			})
		}
	}

	async onRunError(context: CommandContext<typeof memberCreateOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error creating member :(",
		})
	}
}
