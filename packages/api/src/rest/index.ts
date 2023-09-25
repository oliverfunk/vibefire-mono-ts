import { type R2Bucket } from "@cloudflare/workers-types";
import { Hono } from "hono";
import { logger } from "hono/logger";

type Bindings = {
  BUCKET_IMAGES_EU: R2Bucket;
};

const restRouter = new Hono<{ Bindings: Bindings }>();
restRouter.use("*", logger());
restRouter.get("/img/:image-key", async (c) => {
  const imageKey = c.req.param("image-key");

  const maxAge = 60 * 60 * 24 * 5; // 5 days

  const r2_img_object = await c.env.BUCKET_IMAGES_EU.get(imageKey);
  if (!r2_img_object) return c.notFound();

  const img_buffer = await r2_img_object.arrayBuffer();
  const contentType = r2_img_object.httpMetadata?.contentType ?? "";

  return c.body(img_buffer, 200, {
    "Cache-Control": `public, max-age=${maxAge}`,
    "Content-Type": contentType,
  });
});
export { restRouter };
