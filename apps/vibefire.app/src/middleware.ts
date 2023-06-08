import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Store the response so we can modify its headers
  const response = NextResponse.next();

  // Set custom header
  response.headers.set("x-modified-edge", "true");

  // Return response
  return response;
}
