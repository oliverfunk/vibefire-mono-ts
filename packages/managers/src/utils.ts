import { type ClerkSignedInAuthContext } from "@vibefire/services/clerk";

export const safeGet = async <T>(
  getter: Promise<T>,
  errorMessage = "Not found",
) => {
  const res = await getter;
  if (res === null) {
    throw new Error(errorMessage);
  }
  return res;
};

export const checkUserIsPartOfOrg = (
  userAc: ClerkSignedInAuthContext,
  organisationId?: string,
) => {
  if (organisationId !== undefined) {
    if (userAc.organization === undefined) {
      throw new Error("User is not part of an organization");
    }
    if (organisationId !== userAc.organization.id) {
      throw new Error("User is not part of that organization");
    }
    // check if the user has a role that is able to create events for the organization
  }
};
