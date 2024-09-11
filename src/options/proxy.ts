import { createStringOption } from "seyfert"

export const proxyOptions = {
	member: createStringOption({
		description: "The member to proxy as",
		max_length: 100,
		required: true,
	}),
	message: createStringOption({
		description: "The message content",
		required: true,
	}),
}
