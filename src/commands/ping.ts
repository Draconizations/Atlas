import { Declare, Command, type CommandContext, Middlewares } from "seyfert"

@Declare({
	name: "ping",
	description: "Show the ping with discord",
})
@Middlewares(["guild"])
export default class PingCommand extends Command {
	async run(ctx: CommandContext) {
		// average latency between shards
		const ping = ctx.client.gateway.latency

		await ctx.write({
			content: `The ping is \`${ping}\``,
		})
	}
}
