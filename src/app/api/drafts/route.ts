import { createDraft } from "@/nylas";
import { createDraftBody } from "@/openai";

export async function POST(request: Request) {
  const {grantId, messages, subject, to} = (await request.json());
  const body = (await createDraftBody(messages));
  const draft = createDraft(grantId, {
    subject,
    to,
    body
  });

  return Response.json({body});
}