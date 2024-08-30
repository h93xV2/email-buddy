import { getFolders } from "@/nylas";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const grantId = searchParams.get('grantId');

  if (!grantId) {
    return new Response("Missing grant ID", {status: 400});
  }

  const folders = (await getFolders(grantId))['data'];

  return Response.json(folders);
}