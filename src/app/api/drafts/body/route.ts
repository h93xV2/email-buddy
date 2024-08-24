import { getGrant } from "@/nylas";
import { createDraftBody } from "@/openai";
import { Message } from "nylas";

type RequestBody = {
  messages: Message[],
  grantId: string
};

export async function POST(request: Request) {
  const { messages, grantId }: RequestBody = (await request.json());
  const grant = await getGrant(grantId);

  if (!grant.email) {
    return new Response('Unable to get user data', { status: 502 });
  }

  const body = (await createDraftBody(grant.email, messages));

  return Response.json({ body });
}