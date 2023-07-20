type Coord = {
  lat: number;
  lng: number;
};

type VibefireEventAnnouncement = {
  message: string;
  when: Date;
  isNotification: boolean;
  hasNotified: boolean;
  linkedPoiID: string | null;
};
type VibefireEventPOI = {
  coord: Coord;
  description: string;
};
type VibefireEventLocation = {
  addressDescription: string;
  coord: Coord;
  h3: number;
  h3Parents: number[];
};
type VibefireLocEvent = {
  location: VibefireEventLocation;
  displayTimePeriods: string[];
  published: boolean;
  rank: number;
};
type VibefireEvent = {
  type: string;
  eventID: string;
  organisationID: string;
  changeID: string;

  name: string;
  description: string;
  bannerImageURL: string;
  peekImageURL: string | null;
  additionalImageURLs: string[];
  timeStart: Date;
  timeEnd: Date | null;

  announcements: Map<string, VibefireEventAnnouncement> | null;
  pois: Map<string, VibefireEventPOI> | null;

  rank: number;
  vibe: string;
  tags: Set<string> | null;

  location: VibefireEventLocation;
  timeZone: string;
  timeDisplayBegin: Date;
  timeDisplayEnd: Date;
  zoomGroup: string;
  isVisible: boolean;
};

type VibefireEventManagement = {
  organisationID: string;

  limitLocationChanges: number;
  limitTimeStartChanges: number;
  limitNotificationsTotal: number;
  limitOffersTotal: number;
  limitPoisTotal: number;

  actualLocationChanges: number;
  actualTimeStartChanges: number;

  purchasedRanks: number;
  purchasedDisplayPriorHours: number;
  purchasedDisplayPostHours: number;
  purchasedDisplayZoomGroup: number;
};

type VibefireEventOffer = {
  offerID: string;
  organisationID: string;
  description: string;
  live: boolean;
  timesClaimablePerUser: number;
  claimedBy: string[];
  claimableBy: string[] | null;
  linkedPoiID: string | null;
  timeStart: Date | null;
  timeEnd: Date | null;
  totalClaims: number | null;
};

type VibefireUser = {
  userID: string;
  username: string;
  onboardingComplete: boolean;
  banned: boolean;
  name: string | null;
  contactEmail: string | null;
  dateOfBirth: Date | null;
  followedEvents: string[];
  followedOrganisations: string[];
  memberOrganisationID: string | null;
};

export type {
  VibefireEvent,
  VibefireLocEvent,
  VibefireEventManagement,
  VibefireEventAnnouncement,
  VibefireEventOffer,
  VibefireUser,
};
