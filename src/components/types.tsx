import { EmailName, Message } from "nylas";

type ThreadData = {
  subject?: string,
  messages: Message[],
  to?: EmailName[]
};

export { type ThreadData }