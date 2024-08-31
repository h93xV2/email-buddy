import { getGrant } from "@/nylas";
import { isNoReply } from "@/openai";
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
  
  if (messages.length === 0) {
    return Response.json({
      result: false,
      explanation: "There are no emails present"
    })
  }

  const result = (await isNoReply(grant.email, messages));

  return Response.json(result);
}