import { ActionRow, Button } from "seyfert"
import { ButtonStyle } from "seyfert/lib/types"

export function createDeletePrompt() {
	const deleteButton = new Button()
		.setCustomId("delete_system")
		.setLabel("Delete")
		.setStyle(ButtonStyle.Danger)

	const cancelButton = new Button()
		.setCustomId("cancel_deletion")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Secondary)

	const row = new ActionRow<Button>().setComponents([cancelButton, deleteButton])

	return row
}

export function createYesNoPrompt(yes = "Yes", no = "No") {
	const yesButton = new Button()
		.setCustomId("confirm_action")
		.setLabel(yes)
		.setStyle(ButtonStyle.Primary)

	const noButton = new Button()
		.setCustomId("cancel_action")
		.setLabel(no)
		.setStyle(ButtonStyle.Secondary)

	const row = new ActionRow<Button>().setComponents([yesButton, noButton])

	const yesInactive = new Button()
		.setCustomId("confirm_action")
		.setLabel(yes)
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true)

	const noInactive = new Button()
		.setCustomId("cancel_action")
		.setLabel(no)
		.setStyle(ButtonStyle.Secondary)
		.setDisabled(true)

	const inactiveRow = new ActionRow<Button>().setComponents([yesInactive, noInactive])

	return {
		active: row,
		inactive: inactiveRow,
	}
}
