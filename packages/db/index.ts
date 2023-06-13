import { Client } from "fauna";

export * from "./src/fauna/collections/event";

var client: Client | undefined;
// configure your client
export const faunaClientInit = (faunaKey: string) => {
  "use strict";
  if (!client) {
    console.debug("Creating new fauna client");
    client = new Client({
      secret: faunaKey,
    });
  }
  return client;
};

// try {
//   const colPuiblicEvents = doCreatePublicEventsCollection(faunaClient);
//   console.log(colPuiblicEvents);
// } catch (error) {
//   if (error instanceof FaunaError) {
//     // handle errors
//     console.log(error);
//   }
// } finally {
//   // clean up any remaining resources
//   faunaClient.close();
// }
