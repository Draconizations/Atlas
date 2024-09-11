import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert"
import { systemEmbed } from "../../utils/embed"
import { mapEditOptions, systemEditOptions } from "../../options/system"
import { createSystem } from "../../db/system"
import { createYesNoPrompt } from "../../actions/prompts"

@Declare({
	name: "create",
	description: "Creates a new system",
})
@Middlewares(["data"])
@Options(systemEditOptions)
export class CreateSystemCommand extends SubCommand {
	async run(ctx: CommandContext<typeof systemEditOptions, "data">) {
		// check if the account is already linked to a system
		if (ctx.metadata.data.system) {
			ctx.write({
				content: "You already have a system registered. You can view it using `/system view`.",
			})
			return
		}

		const prompt = createYesNoPrompt("Accept", "Cancel")

		const message = await ctx.write(
			{
				content: `⚠️ **This bot is currently under heavy development**
The database can be (and probably will be) reset without warning. Do not store **any** information that you would like to keep permanent

By pressing the button below, **you accept** that features will still **drastically change**. Nothing is guaranteed!`,
				components: [prompt.active],
			},
			true
		)

		const collector = message.createComponentCollector({
			filter: (i) => i.user.id === ctx.author.id && i.isButton(),
			onStop: () => {
				message.edit({
					components: [prompt.inactive],
				})
			},
		})

		collector.run("confirm_action", async (i) => {
			// no system found! let's create one
			let system = await createSystem(ctx.author.id, mapEditOptions(ctx))

			if (system) {
				await i.write({
					content: "Successfully created new system!",
					embeds: [systemEmbed(ctx, system)],
				})
			}

			return collector.stop()
		})

		collector.run("cancel_action", async (i) => {
			await i.write({
				content: "System creation cancelled.",
			})

			return collector.stop()
		})
	}

	async onRunError(context: CommandContext<typeof systemEditOptions, "data">, error: unknown) {
		context.client.logger.fatal(error)
		await context.editOrReply({
			content: "Error creating system :(",
		})
	}
}
