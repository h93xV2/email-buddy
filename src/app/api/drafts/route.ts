import { createDraft } from "@/nylas";
import { EmailName } from "nylas";

// TODO: This should be a shared type with the inbox component
type RequestBody = {
  grantId: string,
  subject?: string,
  to: EmailName[],
  body?: string
};

export async function POST(request: Request) {
  const { grantId, body, subject, to }: RequestBody = (await request.json());

  try {
    createDraft(grantId, {
      subject: subject ? subject : '',
      to,
      body: body ? body : ''
    });
  } catch (error) {
    console.error(error);
  }

  console.log('Draft saved');

  return new Response("Draft saved");
}