import { Hono } from "hono";

// eslint-disable-next-line @typescript-eslint/ban-types
type Bindings = {};

const restRouter = new Hono<{ Bindings: Bindings }>();

export { restRouter };
