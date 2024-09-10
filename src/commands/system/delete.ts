import { CommandContext, Declare, SubCommand } from "seyfert"
import type { AtlasSystemInternal } from "../../types/system"
import db from "../../../db"
import { accounts, systems } from "../../../db/schema"
import { eq } from "drizzle-orm"

@Declare({
  name: "delete",
  description: "Deletes your system"
})
export class DeleteSystemCommand extends SubCommand {
  async run(ctx: CommandContext) {
    let system: AtlasSystemInternal[]|null = null

    try {
      system = await db.select({
        name: systems.name,
        color: systems.color,
        icon: systems.icon,
        id: systems.id
      }).from(systems).innerJoin(accounts, eq(accounts.id, ctx.author.id))
    } catch (e) {
      ctx.write({
        content: "Error fetching system :("
      })
      return
    }

    if (!system || !system[0]) {
      ctx.write({
        content: "You do not have a system registered."
      })
      return
    }

    try {
      await db.update(accounts).set({
        system: null
      }).where(eq(accounts.system, system[0].id))

      await db.delete(systems).where(eq(systems.id, system[0].id))
    } catch (e) {
      ctx.write({
        content: "Error deleting system :("
      })
      return
    }

    ctx.write({
      content: "Successfully deleted system."
    })
  }
}