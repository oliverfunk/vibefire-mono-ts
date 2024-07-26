import { tb, type Static } from "@vibefire/utils";

export const VibefireEventManagementSchema = tb.Object({
  id: tb.String({ default: undefined }),
  eventId: tb.String({ default: undefined }),
  organiserId: tb.String({ default: undefined }),
  organiserType: tb.Union([tb.Literal("user"), tb.Literal("group")], {
    default: undefined,
  }),

  limitNotificationsTotal: tb.Number({ minimum: 0, default: 3 }),

  // only for organisation events
  limitOffersTotal: tb.Number({ minimum: 0, default: 3 }),
  // offer id to user id (phone number?) mappings
  offerClaimedBy: tb.Record(tb.String(), tb.Array(tb.String()), {
    default: {},
  }),
  offerClaimableBy: tb.Record(tb.String(), tb.Array(tb.String()), {
    default: {},
  }),
  limitPoisTotal: tb.Number({ minimum: 0, default: 3 }),

  purchasedRanks: tb.Number({ minimum: 0, default: 0 }),
  purchasedDisplayTimePeriods: tb.Array(tb.String(), { default: [] }),
  purchasedDisplayZoomGroup: tb.Number({ minimum: 0, default: 0 }),
});

export type VibefireEventManagementT = Static<
  typeof VibefireEventManagementSchema
>;
