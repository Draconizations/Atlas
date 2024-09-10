import { Declare, Command, Options } from "seyfert"
import { CreateMemberCommand } from "./create"
import { EditMemberCommand } from "./edit"
import { ViewMemberCommand } from "./view"

@Declare({
	name: "member",
	description: "Member commands",
})
@Options([CreateMemberCommand, EditMemberCommand, ViewMemberCommand])
export default class MemberCommand extends Command {}
