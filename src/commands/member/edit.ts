import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { MemberEmbed } from "../../utils/embed"
import { mapEditOptions, memberEditOptions } from "../../options/member"
import { AtlasError, writeError } from "../../utils/errors"
import { getMemberByName, updateMemberByid } from "../../db/member"

@Declare({
	name: "edit",
	description: "Creates a new member",
})
@Options(memberEditOptions)
@Middlewares(["data"])
export class EditMemberCommand extends SubCommand {
	async run(ctx: CommandContext<typeof memberEditOptions, "data">) {
		const system = ctx.metadata.data.system

		if (!system) {
			await writeError(ctx, AtlasError.system_missing)
			return
		}

		const member = await getMemberByName(system.id, ctx.options.member)
		if (!member || !member.id) {
			await ctx.write({
				content: `❌ Member with name or alias "${ctx.options.member}" not found.`,
			})
			return
		}

		const patch = mapEditOptions(ctx)
		if (Object.values(patch).every((x) => !x)) {
			await writeError(ctx, AtlasError.no_changes)
			return
		}

		const updated = await updateMemberByid(member.id, patch)

		if (updated) {
			await ctx.write({
				content: `Successfully edited ${updated.name}`,
				embeds: [MemberEmbed(ctx, updated, system)],
			})
		}
	}

	async onRunError(context: CommandContext<typeof memberEditOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error editing member :(",
		})
	}
}
