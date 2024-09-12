import {
	CommandContext,
	Declare,
	SubCommand,
	Options,
	Middlewares,
	createStringOption,
} from "seyfert"
import { AtlasError, writeError } from "../../utils/errors"
import { addAlias, getAliasesBySystem, getMemberByName, removeAliasById } from "../../db/member"
import { aliasOptions } from "../../options/member"
import { aliasEmbed } from "../../utils/embed"

@Declare({
	name: "alias",
	description: "Shows or edits aliases for a member",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Middlewares(["data", "guild"])
@Options(aliasOptions)
export class memberAliasCommand extends SubCommand {
	async run(ctx: CommandContext<typeof aliasOptions, "data">) {
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

		const add = ctx.options.add
		const remove = ctx.options.remove

		if (add && remove) {
			await ctx.write({
				content: `❌ Cannot add and remove aliases at the same time. Please run them in separate commands!`,
			})
			return
		}

		if (!add && !remove) {
			await ctx.write({
				embeds: [aliasEmbed(ctx, member, system)],
			})
			return
		}

		if (add) {
			if (member.aliases?.find((a) => a.name?.toLowerCase() === add.toLowerCase())) {
				await ctx.write({
					content: `❌ Member already has "${add}" as an alias.`,
				})
				return
			}
			const systemAliases = await getAliasesBySystem(system.id)
			const existing = systemAliases.find((a) => a.name.toLowerCase() === add.toLowerCase())

			if (existing) {
				const member = await getMemberByName(system.id, existing.name)

				await ctx.write({
					content: `❌ Another member ${member?.name ? `(${member.name})` : ""} already has alias "${add}".`,
				})
				return
			}

			const alias = await addAlias({
				name: add,
				member: member.id,
				system: system.id,
			})
			if (alias) member.aliases?.push(alias)

			await ctx.write({
				content: `Successfully added "${add}" as an alias for ${member.name}.`,
				embeds: [aliasEmbed(ctx, member, system)],
			})
			return
		}

		if (remove) {
			const existing = member.aliases?.find((a) => a.name?.toLowerCase() === remove.toLowerCase())

			if (!existing || !existing.id) {
				await ctx.write({
					content: `❌ Member does not have "${remove}" as an alias.`,
				})
				return
			}

			await removeAliasById(existing.id)
			member.aliases?.filter((a) => a.id !== existing.id)

			await ctx.write({
				content: `Successfully removed alias "${remove}" from ${member.name}.`,
			})
			return
		}
	}

	async onRunError(context: CommandContext<typeof aliasOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		const text = context.options.add
			? "adding alias"
			: context.options.remove
				? "removing alias"
				: "showing aliases"

		await context.editOrReply({
			content: `Error ${text} :(`,
		})
	}
}
