import { EmailName, Message } from "nylas";

type ThreadData = {
  subject?: string,
  messages: Message[],
  to?: EmailName[],
  grantId: string,
  userEmail?: EmailName
};

type DraftResult = {
  body: string
};

export { type ThreadData, type DraftResult }