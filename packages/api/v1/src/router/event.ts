import { z } from "zod";

import { doAddPublicEvent, doCreatePublicEventsCollection } from "@vibefire/db";
import { VibefireEvent } from "@vibefire/types";

// import { createTRPCRouter, publicProcedure } from "../trpc";

// export const postRouter = createTRPCRouter({
//   all: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.post.findMany({ orderBy: { id: "desc" } });
//   }),
//   byId: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .query(({ ctx, input }) => {
//       return ctx.prisma.post.findFirst({ where: { id: input.id } });
//     }),
//   create: publicProcedure
//     .input(
//       z.object({
//         title: z.string().min(1),
//         content: z.string().min(1),
//       }),
//     )
//     .mutation(({ ctx, input }) => {
//       return ctx.prisma.post.create({ data: input });
//     }),
//   delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
//     return ctx.prisma.post.delete({ where: { id: input } });
//   }),
// });

import { authedProcedure, publicProcedure, router } from "../trpc";

export const eventsRouter = router({
  createCollection: authedProcedure.mutation(async ({ ctx }) => {
    await doCreatePublicEventsCollection(ctx.faunaClient);
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
});
