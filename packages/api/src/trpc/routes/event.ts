import { Static, Type as t, TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { ValueErrorIterator } from "@sinclair/typebox/errors";
import { Value } from "@sinclair/typebox/value";
import { z } from "zod";

import {
  doAddPublicLocEvent,
  doCreatePublicEventsCollection,
  queryPublicEventsWhenWhere,
} from "@vibefire/db";
import { CoordSchema, VibefireEventSchema } from "@vibefire/models";
import {
  cellToParent,
  compactCells,
  hexToDecimal,
  latLngToCell,
  polygonToCells,
  zoomLevelToH3Resolution,
} from "@vibefire/utils";

import { v } from "~/utils";
import { authedProcedure, publicProcedure, router } from "../trpc-router";

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
        visibility: "public",
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
      v(
        t.Object({
          timePeriod: t.String(),
          northEast: CoordSchema,
          southWest: CoordSchema,
          zoomLevel: t.Number(),
        }),
      ),
    )
    .output(v(t.Array(VibefireEventSchema)))
    .query(async ({ ctx, input }) => {
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

      // const bboxH3s = compactCells(bboxH3sPre);
      const bboxH3s = bboxH3sPre;
      if (!bboxH3s.length) {
        return [];
      }

      console.log("bboxH3sPre no", bboxH3sPre.length);
      console.log("bboxH3s no", bboxH3s.length);

      const h3ps = bboxH3s.map((h3) => hexToDecimal(h3));
      const res = await queryPublicEventsWhenWhere(
        ctx.faunaClient,
        timePeriod,
        h3ps,
      );

      const events = res.data?.map((eventData) =>
        v(VibefireEventSchema)(eventData),
      );

      console.log("events.length", events.length);

      return events;
    }),
});
