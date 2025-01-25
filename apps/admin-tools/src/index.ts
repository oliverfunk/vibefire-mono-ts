import { resourceLocator } from "@vibefire/utils";

import { createGroup } from "./create-group";
import { genEvent } from "./gen-event";

resourceLocator().setCtx({
  fauna: {
    roleKey: process.env.FAUNA_ROLE_KEY!,
  },
  gooleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  },
  cloudFlare: {
    accountId: process.env.CF_ACCOUNT_ID!,
    imagesApiKey: process.env.CF_IMAGES_API_KEY!,
  },
});

async function main() {
  await genEvent();
  // await createGroup();
}
void main();
