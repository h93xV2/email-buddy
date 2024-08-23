import { createDraft } from "@/nylas";
import { EmailName } from "nylas";

// TODO: This should be a shared type with the inbox component
type RequestBody = {
  grantId: string,
  subject: string,
  to: EmailName[],
  body: string
};

export async function POST(request: Request) {
  const {grantId, body, subject, to}: RequestBody = (await request.json());

  createDraft(grantId, {
    subject,
    to,
    body
  });

  return new Response("Draft saved");
}