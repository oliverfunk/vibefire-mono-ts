export const runtime = "edge";

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      applinks: {
        details: [
          {
            appIDs: ["B623YXPG6K.app.vibefire.ios"],
            components: [
              {
                "/e/": "*",
                comment: "Matches any event link path",
              },
            ],
          },
        ],
      },
      activitycontinuation: {
        apps: ["B623YXPG6K.app.vibefire.ios"],
      },
      webcredentials: {
        apps: ["B623YXPG6K.app.vibefire.ios"],
      },
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
