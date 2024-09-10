import { Declare, Command, Options } from "seyfert";
import { CreateSystemCommand } from "./create";
import { DeleteSystemCommand } from "./delete";

@Declare({
  name: "system",
  description: "System commands"
})
@Options([CreateSystemCommand, DeleteSystemCommand])
export default class SystemCommand extends Command {}