import { CommandContext, Declare, SubCommand, Options, createStringOption, type OKFunction } from "seyfert";
import db from "../../../db";
import { accounts, systems } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { isUrl } from "../../utils/utils";
import type { AtlasSystemInternal } from "../../types/system";
import { systemEmbed } from "../../utils/embed";
import type { DiscordAccount } from "../../types/account";

const options = {
  name: createStringOption({
    description: "Adds a system name",
    max_length: 100,
    required: false
  }),
  color: createStringOption({
    description: "Adds a decorative system color",
    max_length: 7,
    min_length: 6,
    required: false,
    value(data, ok: OKFunction<string>, fail) {
      const match = data.value.match(/^#?([0-9a-fA-F]{6})$/)
      if (match && match[1]) return ok(match[1])
      fail("Expected a valid hex color (i.e. #aabbcc)")
    }
  }),
  icon: createStringOption({
    description: "Sets a system icon with the given URL",
    required: false,
    value(data, ok: OKFunction<URL>, fail) {
      if (isUrl(data.value)) return ok(new URL(data.value));
        fail('expected a valid url');
    }
  })
}


@Declare({
  name: "create",
  description: "Creates a new system"
})
@Options(options)
export class CreateSystemCommand extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    let account: DiscordAccount[]|null = null

    // check if the account is already linked to a system
    try {
      account = await db.select().from(accounts).where(eq(accounts.id, ctx.author.id))
      if (account && account[0] && account[0].system) {
          await ctx.write({
          content: "You already have a system registered."
        })
        return
      }
    } catch(e) {
      await ctx.write({
        content: "Error fetching system :("
      })
      return
    }

    // no system found! let's create one
    try {
      const system: AtlasSystemInternal[] = await db.insert(systems).values({
        name: ctx.options.name,
        color: ctx.options.color,
        icon: ctx.options.icon?.toString()
      }).returning()

      if (!account || !account[0]) {
        await db.insert(accounts).values({
          id: ctx.author.id,
          system: system[0].id
        })
      } else {
        await db.update(accounts).set({
          system: system[0].id
        }).where(eq(accounts.id, account[0].id))
      }

      ctx.write({
        content: "Successfully created new system!",
        embeds: [systemEmbed(system[0])]
      })
    } catch (e) {
      await ctx.write({
        content: "Error creating system :("
      })
      return
    }
  }
}