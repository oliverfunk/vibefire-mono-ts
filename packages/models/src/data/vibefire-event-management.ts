import { Type as t, type Static } from "@sinclair/typebox";

export const VibefireEventManagementSchema = t.Object({
  id: t.String({ default: undefined }),
  eventId: t.String({ default: undefined }),
  organiserId: t.String({ default: undefined }),
  organiserType: t.Union([t.Literal("user"), t.Literal("group")], {
    default: undefined,
  }),

  limitNotificationsTotal: t.Number({ minimum: 0, default: 3 }),

  // only for organisation events
  limitOffersTotal: t.Number({ minimum: 0, default: 3 }),
  // offer id to user id (phone number?) mappings
  offerClaimedBy: t.Record(t.String(), t.Array(t.String()), {
    default: {},
  }),
  offerClaimableBy: t.Record(t.String(), t.Array(t.String()), {
    default: {},
  }),
  limitPoisTotal: t.Number({ minimum: 0, default: 3 }),

  purchasedRanks: t.Number({ minimum: 0, default: 0 }),
  purchasedDisplayTimePeriods: t.Array(t.String(), { default: [] }),
  purchasedDisplayZoomGroup: t.Number({ minimum: 0, default: 0 }),
});

export type VibefireEventManagementT = Static<
  typeof VibefireEventManagementSchema
>;
