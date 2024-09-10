import { createStringOption, type OKFunction } from "seyfert";
import { isUrl } from "../utils/utils";

export const systemEditOptions = {
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