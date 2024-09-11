import { Declare, Command, Options } from "seyfert"
import { CreateSystemCommand } from "./create"
import { DeleteSystemCommand } from "./delete"
import { ViewSystemCommand } from "./view"
import { EditSystemCommand } from "./edit"

@Declare({
	name: "system",
	description: "System commands",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Options([ViewSystemCommand, CreateSystemCommand, EditSystemCommand, DeleteSystemCommand])
export default class SystemCommand extends Command {}
