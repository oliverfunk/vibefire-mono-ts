export type ManagersContext = Partial<{
  cfAccountId: string;
  cfImagesApiKey: string;
  clerkPemString: string;
  clerkSecretKey: string;
  clerkPublicKey: string;
  clerkWebhookEventSecret: string;
  googleMapsApiKey: string;
  faunaClientKey: string;
  supabaseClientKey: string;
  expoAccessToken: string;
  vfNotifServiceAccessToken: string;
  vfSmsServiceAccessToken: string;
}>;

let _ManagersContext: ManagersContext | undefined;
export const setManagersContext = (ctx: ManagersContext) => {
  _ManagersContext = ctx;
};
export const managersContext = (): ManagersContext => {
  if (!_ManagersContext) {
    throw new Error("ManagersContext not set");
  }
  return _ManagersContext;
};
