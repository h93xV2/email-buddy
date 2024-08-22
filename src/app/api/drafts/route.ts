import { createDraft, getGrant } from "@/nylas";
import { createDraftBody } from "@/openai";
import { EmailName, Message } from "nylas";

// TODO: This should be a shared type with the inbox component
type RequestBody = {
  grantId: string,
  messages: Message[],
  subject: string,
  to: EmailName[]
};

export async function POST(request: Request) {
  const {grantId, messages, subject, to}: RequestBody = (await request.json());
  const grant = await getGrant(grantId);

  if (!grant.email) {
    return new Response('Unable to get user data', {status: 502});
  }

  const body = (await createDraftBody(grant.email, messages));
  const draft = createDraft(grantId, {
    subject,
    to,
    body
  });

  return Response.json({body});
}