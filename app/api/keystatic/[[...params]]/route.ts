import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";

// Dev-only Keystatic API. Mirror of the admin page gate: 404 in production so the
// authoring endpoints aren't reachable on the live site.
const handlers = makeRouteHandler({ config });

const prod = process.env.NODE_ENV === "production";

export const GET = prod
  ? () => new Response("Not found", { status: 404 })
  : handlers.GET;
export const POST = prod
  ? () => new Response("Not found", { status: 404 })
  : handlers.POST;
