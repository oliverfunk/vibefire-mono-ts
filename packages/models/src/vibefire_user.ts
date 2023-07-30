export type VibefireUser = {
  id: string;
  aid: string;
  onboardingComplete: boolean;
  name: string;
  contactEmail?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  followedEvents: string[];
  followedOrganisations: string[];
};
