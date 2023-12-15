export const runtime = "edge";

export async function GET(request: Request) {
  return new Response(
    JSON.stringify([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "Vibefire",
          package_name: "app.vibefire.and",
          sha256_cert_fingerprints: [
            "41:94:75:45:05:CB:5F:DE:1E:AC:A0:65:EA:B9:65:16:53:AD:72:FB:94:AC:9B:26:5A:87:8C:D9:FD:FF:FB:D4",
          ],
        },
      },
    ]),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
