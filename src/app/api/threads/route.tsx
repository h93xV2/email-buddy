import { getThreadsByFolderId, setThreadToRead } from "@/nylas";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const folderId = searchParams.get('folderId');
  const grantId = searchParams.get('grantId');

  if (!grantId || !folderId) {
    return new Response("Missing grant ID or folder ID", { status: 400 });
  }

  const threads = (await getThreadsByFolderId(grantId, folderId))['data'];

  return new Response(JSON.stringify(threads));
}

export async function PUT(request: Request) {
  const {threadId, grantId} = await request.json();

  setThreadToRead(grantId, threadId);

  return new Response(null, {status: 204});
}