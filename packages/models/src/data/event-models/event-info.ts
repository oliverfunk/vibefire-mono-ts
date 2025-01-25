import { CoordSchema, SocialLinksModel } from "!models/general";
import { clearable, tb, Value, type Static } from "!models/modelling";

const EventInfoParkingModel = tb.Object({
  type: tb.Literal("parking"),
  value: tb.String(),
});
const EventInfoTagsModel = tb.Object({
  type: tb.Literal("tags"),
  value: tb.Array(tb.String(), { default: [], uniqueItems: true }),
});
const EventInfoSocialLinksModel = tb.Object({
  type: tb.Literal("socialLinks"),
  value: SocialLinksModel,
});

export const EventInfoModel = tb.Union([
  EventInfoParkingModel,
  EventInfoTagsModel,
  EventInfoSocialLinksModel,
]);
