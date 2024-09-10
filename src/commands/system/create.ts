import { CommandContext, Declare, SubCommand, Options, Middlewares } from "seyfert";
import { systemEmbed } from "../../utils/embed";
import { systemEditOptions } from "../../options/system";
import { createSystem } from "../../db/system";


@Declare({
  name: "create",
  description: "Creates a new system"
})
@Middlewares(["data"])
@Options(systemEditOptions)
export class CreateSystemCommand extends SubCommand {
  async run(ctx: CommandContext<typeof systemEditOptions, "data">) {
    // check if the account is already linked to a system
    if (ctx.metadata.data.system) {
      ctx.write({
        content: "You already have a system registered. You can view it using `/system view`."
      })
      return
    }

    // no system found! let's create one
    const data = {
      name: ctx.options.name,
      color: ctx.options.color,
      icon: ctx.options.icon?.toString()
    }
    let system = await createSystem(ctx.author.id, data)
    
    if (system) {
      ctx.write({
        content: "Successfully created new system!",
        embeds: [systemEmbed(system)]
      })
    }
  }

  async onRunError(context: CommandContext<typeof systemEditOptions, "data">, error: unknown) {
    context.client.logger.fatal(error);
    await context.editOrReply({
      content: "Error creating system :("
    });
  }
}