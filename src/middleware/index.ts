import { AtlasDataMiddleWare } from "./data"
import { checkGuildMiddleware } from "./guild"

export default {
	data: AtlasDataMiddleWare,
	guild: checkGuildMiddleware,
}
