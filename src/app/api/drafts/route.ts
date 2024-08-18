import { createDraft } from "@/nylas";
import { createDraftBody } from "@/openai";

export async function POST(request: Request) {
  const {messages, subject, to} = (await request.json());
  const body = (await createDraftBody(messages));
  const draft = createDraft({
    subject,
    to,
    body
  });

  return Response.json({body});
}