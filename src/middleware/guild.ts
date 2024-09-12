import { createMiddleware } from "seyfert"
import { MessageFlags } from "seyfert/lib/types"

export const checkGuildMiddleware = createMiddleware(async (middle) => {
	if (
		middle.context.interaction.context === 0 &&
		!middle.context.interaction.authorizingIntegrationOwners["0" as keyof {}]
	) {
		await middle.context.write({
			content: `❌ This server does not have Atlas installed.`,
			flags: MessageFlags.Ephemeral,
		})
		middle.pass()
	} else {
		middle.next({})
	}
})
