import { Type as t, type Static } from "@sinclair/typebox";

export const TimeOfDaySchema = t.Union([
  t.Literal("D"),
  t.Literal("E"),
  t.Literal("M"),
  t.Literal("A"),
  t.Literal("N"),
]);
export type TimeOfDayT = Static<typeof TimeOfDaySchema>;

export const TimePeriodSchema = t.String({
  pattern: String.raw`^(20\d{2})(\d{2})(\d{2})$`,
});

export type TimePeriodT = Static<typeof TimePeriodSchema>;

export const CoordSchema = t.Object({ lat: t.Number(), lng: t.Number() });
export type CoordT = Static<typeof CoordSchema>;

export const MapPositionInfoSchema = t.Object({
  northEast: CoordSchema,
  southWest: CoordSchema,
  zoomLevel: t.Number(),
});
export type MapPositionInfoT = Static<typeof MapPositionInfoSchema>;

export const MapDisplayEventsInfoSchema = t.Object({
  numberOfEvents: t.Number(),
  queryStatus: t.Union([t.Literal("loading"), t.Literal("done")]),
});
export type MapDisplayEventsInfoT = Static<typeof MapDisplayEventsInfoSchema>;

export const MapQuerySchema = t.Object({
  timePeriod: TimePeriodSchema,
  northEast: CoordSchema,
  southWest: CoordSchema,
  zoomLevel: t.Number({ minimum: 0, maximum: 24 }),
});
export type MapQueryT = Static<typeof MapQuerySchema>;

export const VibefireIndexableLocationSchema = t.Object(
  {
    addressDescription: t.String(),
    position: CoordSchema,
    h3: t.Number(),
    h3Parents: t.Array(t.Number()),
  },
  { default: undefined },
);
