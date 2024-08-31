import { getLatestInboundMessage } from '@/app/utils/get-to';
import { Message } from 'nylas';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

type MessageType = { role: Role, content: string };

const getDraftCreationPrompt = (userName?: string) => {
  return `
    You are an intelligent email assistant. Your job is to write a reply to an email thread.

    Only write the body of the email.${userName ? ' Include the signature ' + userName : ''}
  `;
};

const createDraftBody = async (userEmail: string, emailsInThread: Message[]) => {
  const emailThreadCopy: Message[] = JSON.parse(JSON.stringify(emailsInThread));
  emailThreadCopy.sort((a, b) => a.date - b.date);

  const messages: MessageType[] = emailThreadCopy.map(message => {
    if (message.to.map(sender => sender.email).includes(userEmail)) {
      return { "role": Role.USER, "content": message.body || '' };
    }

    return { "role": Role.ASSISTANT, "content": message.body || '' };
  });
  const userMessage = emailThreadCopy.find(message => message.to.map(recipient => recipient.email).includes(userEmail));
  const possibleUser = userMessage?.to.find(possibleUser => possibleUser.email === userEmail);
  const userName = possibleUser?.name;
  const allMessages: MessageType[] = [{ "role": Role.SYSTEM, "content": getDraftCreationPrompt(userName) }]
    .concat(messages);
  const result = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: allMessages
  });

  return result.choices[0].message.content || '';
};

const IsNoReplyResult = z.object({
  isNoReply: z.boolean(),
  explanation: z.string()
})

type IsNoReplyResult = z.infer<typeof IsNoReplyResult>;

const IS_NO_REPLY_PROMPT = `
You are a hyper intelligent email screener.
A user will present you with an email message they received.
Your job is to determine if the email should be replied to.
Respond with true if the email is a no-reply and false otherwise.
Include an explanation about why someone might not want to reply.
Caution is preferred.
`;

const isNoReply = async (userEmail: string, emailsInThread: Message[]) => {
  const messages: Message[] = JSON.parse(JSON.stringify(emailsInThread));
  messages.sort((a, b) => b.date - a.date);

  const latestInboundMessage = getLatestInboundMessage(messages, { email: userEmail });
  const result = await client.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      { "role": Role.SYSTEM, "content": IS_NO_REPLY_PROMPT },
      { "role": Role.USER, "content": JSON.stringify(latestInboundMessage) }
    ],
    response_format: zodResponseFormat(IsNoReplyResult, "result")
  });
  const analysis = result.choices[0].message.parsed;

  console.log(analysis);

  return analysis;
};

export { createDraftBody, isNoReply, type IsNoReplyResult };