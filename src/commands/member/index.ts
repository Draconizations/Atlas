import { Declare, Command, Options } from "seyfert"
import { CreateMemberCommand } from "./create"
import { EditMemberCommand } from "./edit"
import { ViewMemberCommand } from "./view"
import { memberAliasCommand } from "./alias"

@Declare({
	name: "member",
	description: "Member commands",
	integrationTypes: ["GuildInstall", "UserInstall"],
	contexts: ["BotDM", "Guild", "PrivateChannel"],
})
@Options([CreateMemberCommand, EditMemberCommand, ViewMemberCommand, memberAliasCommand])
export default class MemberCommand extends Command {}
