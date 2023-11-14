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
  pattern: `^[0-9]{8}\/[D,E,M,A,N]$`,
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

export const MapQueryInfoSchema = t.Object({
  numberOfEvents: t.Number(),
  queryStatus: t.Union([t.Literal("loading"), t.Literal("done")]),
});
export type MapQueryInfoT = Static<typeof MapQueryInfoSchema>;

export const MapQuerySchema = t.Object({
  timePeriod: TimePeriodSchema,
  northEast: CoordSchema,
  southWest: CoordSchema,
  zoomLevel: t.Number({ minimum: 0, maximum: 24 }),
});
export type MapQueryT = Static<typeof MapQuerySchema>;
