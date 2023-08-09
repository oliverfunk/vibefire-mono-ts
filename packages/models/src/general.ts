import { Static, Type as t } from "@sinclair/typebox";

export const TimePeriodSchema = t.String({ pattern: `^[0-9]{8}\/[E,M,A,N]$` });
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
