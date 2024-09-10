import type { CommandContext } from "seyfert";

export enum AtlasError {
  system_missing = "You do not have a system registered. To create one, use `/system create`.",
  other_system_missing = "This account does not have a system registered."
}

export async function writeError(ctx: CommandContext, error: AtlasError) {
  await ctx.write({
    content: `❌ ${error.toString()}`
  })
}