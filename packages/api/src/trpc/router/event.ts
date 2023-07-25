import { z } from "zod";

import {
  doAddPublicLocEvent,
  doCreatePublicEventsCollection,
  queryPublicEventsWhenWhere,
} from "@vibefire/db";
import {
  cellToParent,
  compactCells,
  hexToDecimal,
  latLngToCell,
  polygonToCells,
  zoomLevelToH3Resolution,
} from "@vibefire/utils";

import { authedProcedure, publicProcedure, router } from "../trpc";

const CoordSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
const VibefireEventLocationSchema = z.object({
  addressDescription: z.string(),
  coord: CoordSchema,
  h3: z.number(),
  h3Parents: z.array(z.number()),
});
const VibefireEventSchema = z.object({
  id: z.string(),
  location: VibefireEventLocationSchema,
  displayTimePeriods: z.array(z.string()),
  published: z.boolean(),
  rank: z.number(),
});

export const eventsRouter = router({
  addLocEvent: publicProcedure
    .input(
      z.object({
        eventPosition: z.object({ lat: z.number(), lng: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input: { eventPosition } }) => {
      const h3 = latLngToCell(eventPosition.lat, eventPosition.lng, 15);
      // console.log("h3 dec", hexToDecimal(h3));
      const coarsestZoomRes = 0;
      const finestZoomRes = 15;
      const h3Parents = [];
      for (let i = finestZoomRes; i >= coarsestZoomRes; i--) {
        h3Parents.push(cellToParent(h3, i));
      }

      const h3Dec = hexToDecimal(h3);
      const h3ParentsDec = h3Parents.map((h3) => hexToDecimal(h3));

      const id1 = await doAddPublicLocEvent(ctx.faunaClient, {
        location: {
          coord: eventPosition,
          addressDescription: "20230720",
          h3: h3Dec,
          h3Parents: h3ParentsDec,
        },
        displayTimePeriods: ["20230720/A", "20230720/N"],
        rank: Math.floor(Math.random() * 10),
        published: true,
      });
      console.log("id", id1);

      return "succ";
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        coord: z.object({ lat: z.number(), lng: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //   await doAddPublicEvent(ctx.faunaClient, {
      //     name: input.name,
      //   });
    }),
  queryPublicEventsWhenWhere: publicProcedure
    .input(
      z.object({
        timePeriod: z.string(),
        northEast: z.object({ lat: z.number(), lng: z.number() }),
        southWest: z.object({ lat: z.number(), lng: z.number() }),
        zoomLevel: z.number(),
      }),
    )
    .output(z.array(VibefireEventSchema))
    .query(async ({ ctx, input }) => {
      var startTime = performance.now();

      // todo: validate timePeriod
      const timePeriod = input.timePeriod;

      console.log();
      console.log("timePeriod", input.timePeriod);
      console.log("northEast", JSON.stringify(input.northEast, null, 2));
      console.log("southWest", JSON.stringify(input.southWest, null, 2));
      console.log("zoomLevel", input.zoomLevel);
      console.log();
      console.log(
        "lats delta",
        Math.abs(input.northEast.lat - input.southWest.lat),
      );
      console.log(
        "longs delta",
        Math.abs(input.northEast.lng - input.southWest.lng),
      );
      console.log();

      // quadrantize the bbox, merge the cells, then query

      const h3Res = zoomLevelToH3Resolution(input.zoomLevel);

      const bboxH3sPre = polygonToCells(
        [
          [input.northEast.lat, input.northEast.lng],
          [input.northEast.lat, input.southWest.lng],
          [input.southWest.lat, input.southWest.lng],
          [input.southWest.lat, input.northEast.lng],
        ],
        h3Res,
      );

      console.log("bboxH3sPre no", bboxH3sPre.length);

      const bboxH3s = compactCells(bboxH3sPre);
      if (!bboxH3s.length) {
        return [];
      }

      console.log("bboxH3s no", bboxH3s.length);

      const h3ps = bboxH3s.map((h3) => hexToDecimal(h3));
      const res = await queryPublicEventsWhenWhere(
        ctx.faunaClient,
        timePeriod,
        h3ps,
      );

      console.log("res.data?.data.length", res.data?.data.length);

      const events = res.data?.data.map((eventData) =>
        VibefireEventSchema.parse(eventData),
      );

      console.log("ret.length", events.length);

      var endTime = performance.now();
      console.log("### ->queryEvents, time", endTime - startTime);

      return events;
    }),
});
