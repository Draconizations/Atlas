import { ActionRow, Button } from "seyfert";
import { ButtonStyle } from "seyfert/lib/types";

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