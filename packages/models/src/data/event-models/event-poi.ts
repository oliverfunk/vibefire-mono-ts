import { CoordSchema } from "!models/general";
import { clearable, tb, Value, type Static } from "!models/modelling";

// poi
const PoiModel = tb.Object({
  id: tb.String(),
  position: CoordSchema,
  label: tb.String({ default: undefined, maxLength: 100, minLength: 1 }),
});
export type EventDetailPoiModel = Static<typeof EventDetailPoiModel>;
export const EventDetailPoiModel = tb.Object({
  type: tb.Literal("poi"),
  blockTitle: tb.String({ default: "Points of Interest" }),
  value: tb.Array(PoiModel, { default: [] }),
});
export const newEventDetailPoiModel = (
  value: EventDetailPoiModel["value"],
  blockTitle: string,
): EventDetailPoiModel => {
  const mv = Value.Create(EventDetailPoiModel);
  mv.value = value;
  mv.blockTitle = blockTitle;
  return mv;
};
// poi
