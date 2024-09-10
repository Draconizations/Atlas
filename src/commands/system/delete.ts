import { CommandContext, Declare, SubCommand, Middlewares } from "seyfert"
import { AtlasError, writeError } from "../../utils/errors"
import { createDeletePrompt } from "../../actions/prompts"
import { deleteSystemById } from "../../db/system"

@Declare({
  name: "delete",
  description: "Deletes your system"
})
@Middlewares(["data"])
export class DeleteSystemCommand extends SubCommand {
  async run(ctx: CommandContext<{}, "data">) {
    let system = ctx.metadata.data.system
    if (!system) {
      await writeError(ctx, AtlasError.system_missing)
      return
    }
    
    const message = await ctx.write({
      content: "Are you sure you want to delete your system? **This is irreversible!**",
      components: [createDeletePrompt()]
    }, true)

    const collector = message.createComponentCollector({
      filter: (i) => i.user.id === ctx.author.id && i.isButton()
    })

    collector.run("delete_system", async (i) => {
      if (system) {
        await deleteSystemById(system.id)
        collector.stop("deleted")
        return await i.write({
          content: "System successfully deleted."
        })
      }
    })

    collector.run("cancel_deletion", async (i) => {
      collector.stop()
      return await i.write({
        content: "System deletion cancelled."
      })
    })
  }
}