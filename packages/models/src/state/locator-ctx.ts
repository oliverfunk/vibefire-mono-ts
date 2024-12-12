export type LocatorContext = {
  fauna?: {
    roleKey: string;
  };
  clerk?: {
    secretKey: string;
    pemString: string;
    publishableKey: string;
    apiUrl?: string;
  };
  gooleMaps?: {
    apiKey: string;
  };
  cloudFlare?: {
    accountId: string;
    imagesApiKey: string;
  };
  webhooks?: {
    clerkValidationSecret?: string;
  };
};
