// @ts-check is better
import { config } from 'seyfert';

export default config.bot({
   token: process.env.BOT_TOKEN ?? "",
   locations: {
       base: "src",
       output: "src",
       commands: "commands"
   }
});