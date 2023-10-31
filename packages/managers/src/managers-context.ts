export type ManagersContext = Partial<{
  cfAccountId: string;
  cfImagesApiKey: string;
  clerkPemString: string;
  clerkIssuerApiUrl: string;
  clerkWebhookSecret: string;
  googleMapsApiKey: string;
  faunaClientKey: string;
  supabaseClientKey: string;
}>;

let _ManagersContext: ManagersContext | undefined;
export const setManagersContext = (ctx: ManagersContext) => {
  _ManagersContext = ctx;
};
export const getManagersContext = (): ManagersContext => {
  if (!_ManagersContext) {
    throw new Error("ManagersContext not set");
  }
  return _ManagersContext;
};
