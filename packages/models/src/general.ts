import { tb, type Static } from "!models/modelling";

export const TimeOfDaySchema = tb.Union([
  tb.Literal("D"),
  tb.Literal("E"),
  tb.Literal("M"),
  tb.Literal("A"),
  tb.Literal("N"),
]);
export type TimeOfDayT = Static<typeof TimeOfDaySchema>;

export const DatePeriodSchema = tb.Number({
  minimum: 20000101,
  maximum: 20991231,
  // pattern: String.raw`^(20\d{2})(\d{2})(\d{2})$`,
});
export const ModelDatePeriodString = tb.String({
  pattern: String.raw`^(20\d{2})(\d{2})(\d{2})$`,
});

export type DatePeriodT = Static<typeof DatePeriodSchema>;

export const CoordSchema = tb.Object(
  { lat: tb.Number(), lng: tb.Number() },
  { default: { lat: 0, lng: 0 } },
);
export type CoordT = Static<typeof CoordSchema>;

export const MapPositionInfoSchema = tb.Object({
  northEast: CoordSchema,
  southWest: CoordSchema,
  zoomLevel: tb.Number(),
});
export type MapPositionInfoT = Static<typeof MapPositionInfoSchema>;

export const MapDisplayEventsInfoSchema = tb.Object({
  numberOfEvents: tb.Number(),
  queryStatus: tb.Union([tb.Literal("loading"), tb.Literal("done")]),
});
export type MapDisplayEventsInfoT = Static<typeof MapDisplayEventsInfoSchema>;

export const MapQuerySchema = tb.Object({
  datePeriod: DatePeriodSchema,
  northEast: CoordSchema,
  southWest: CoordSchema,
  zoomLevel: tb.Number({ minimum: 0, maximum: 24 }),
});
export type MapQueryT = Static<typeof MapQuerySchema>;

export const VibefireIndexableLocationSchema = tb.Object(
  {
    addressDescription: tb.String(),
    position: CoordSchema,
    h3: tb.Number(),
    h3Parents: tb.Array(tb.Number()),
  },
  { default: undefined },
);

export const VibefireLocationSchema = tb.Object({
  addressDescription: tb.String({ default: "" }),
  position: CoordSchema,
});

export const SocialLinksModel = tb.Object(
  {
    x: tb.Optional(tb.String({ default: undefined })),
    facebook: tb.Optional(tb.String({ default: undefined })),
    instagram: tb.Optional(tb.String({ default: undefined })),
    tiktok: tb.Optional(tb.String({ default: undefined })),
    website: tb.Optional(tb.String({ default: undefined })),
  },
  { default: {} },
);
