import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

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

export const VibefireLocationSchema = t.Object(
  {
    addressDescription: t.String(),
    position: CoordSchema,
  },
  { default: undefined },
);

export type TModelVibefireEntityAccess = Static<
  typeof ModelVibefireEntityAccess
>;
export type TModelVibefireEntityAccessParams = Omit<
  TModelVibefireEntityAccess,
  "id"
>;
export const ModelVibefireEntityAccess = t.Object({
  id: t.String({ default: undefined }),
  type: t.Union([t.Literal("public"), t.Literal("open"), t.Literal("invite")]),
  inviteCode: t.Optional(t.String()),
});
export const newVibefireEntityAccess = (
  p: TModelVibefireEntityAccessParams,
): TModelVibefireEntityAccess => {
  const d = Value.Create(ModelVibefireEntityAccess);
  d.type = p.type;
  d.inviteCode = p.inviteCode;
  return d;
};
