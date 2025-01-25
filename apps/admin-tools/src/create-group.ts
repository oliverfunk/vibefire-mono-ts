import "dotenv/config";

import { getUFGroupsManager } from "@vibefire/managers/userfacing";

export const createGroup = async () => {
  await getUFGroupsManager().createNewGroup({
    accessType: "public",
    description: "A test group for testing group event creation",
    name: "Vibefire Test Group",
    userAid: process.env.TEST_USER_AID!,
  });
};
