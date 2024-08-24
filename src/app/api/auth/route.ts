import { getGoogleAuthUrl } from "@/nylas";

export async function GET(request: Request) {
  const userEmail = new URL(request.url).searchParams.get('userEmail');

  if (userEmail) {
    const authUrl = await getGoogleAuthUrl(userEmail);

    return Response.redirect(authUrl);
  }

  return new Response('Missing user email', { status: 400 });
}