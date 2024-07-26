import { tb, Value, type Static } from "@vibefire/utils";

export const TimeOfDaySchema = tb.Union([
  tb.Literal("D"),
  tb.Literal("E"),
  tb.Literal("M"),
  tb.Literal("A"),
  tb.Literal("N"),
]);
export type TimeOfDayT = Static<typeof TimeOfDaySchema>;

export const TimePeriodSchema = tb.String({
  pattern: String.raw`^(20\d{2})(\d{2})(\d{2})$`,
});

export type TimePeriodT = Static<typeof TimePeriodSchema>;

export const CoordSchema = tb.Object({ lat: tb.Number(), lng: tb.Number() });
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
  timePeriod: TimePeriodSchema,
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

export const VibefireLocationSchema = tb.Object(
  {
    addressDescription: tb.String(),
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
export const ModelVibefireEntityAccess = tb.Object({
  id: tb.String({ default: undefined }),
  type: tb.Union([
    tb.Literal("public"),
    tb.Literal("open"),
    tb.Literal("invite"),
  ]),
  inviteCode: tb.Optional(tb.String()),
});
export const newVibefireEntityAccess = (
  p: TModelVibefireEntityAccessParams,
): TModelVibefireEntityAccess => {
  const d = Value.Create(ModelVibefireEntityAccess);
  d.type = p.type;
  d.inviteCode = p.inviteCode;
  return d;
};
