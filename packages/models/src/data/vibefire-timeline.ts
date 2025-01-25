import { CoordSchema } from "!models/general";
import { clearable, tb, Value, type Static } from "!models/modelling";

// timeline
const TimelineElementModel = tb.Object({
  elementId: tb.String(),
  message: tb.String({ default: undefined }),
  tsWhen: tb.String({ default: undefined }),
  isNotification: tb.Boolean({ default: false }),
  hasNotified: tb.Boolean({ default: false }),
});
export type EventDetailTimelineModel = Static<
  typeof EventDetailSimpleTimelineModel
>;
export const EventDetailSimpleTimelineModel = tb.Object({
  type: tb.Literal("timeline"),
  blockTitle: tb.String({ default: "Timeline" }),
  value: tb.Array(TimelineElementModel, { default: [] }),
});
export const newEventDetailTimelineModel = (
  value: EventDetailTimelineModel["value"],
  blockTitle: string,
): EventDetailTimelineModel => {
  const mv = Value.Create(EventDetailSimpleTimelineModel);
  mv.value = value;
  mv.blockTitle = blockTitle;
  return mv;
};
// timeline
