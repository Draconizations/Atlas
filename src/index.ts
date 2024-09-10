import { Client, type ParseClient, type ParseMiddlewares } from "seyfert";
import middleware from "./middleware";

const client = new Client();

// This will start the connection with the gateway and load commands, events, components and langs
await client.start();

client.setServices({
  middlewares: middleware
})

await client.uploadCommands()

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> { }
  interface RegisteredMiddlewares
  extends ParseMiddlewares<typeof middleware> {}
}