import { EmailName, Message } from "nylas";
import { IsNoReplyResult } from "./openai";

type ThreadData = {
  subject?: string,
  messages: Message[],
  to?: EmailName[],
  grantId: string,
  userEmail?: EmailName,
  isNoReply?: IsNoReplyResult
};

type DraftResult = {
  body: string
};

export { type ThreadData, type DraftResult }