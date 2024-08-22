import { Message } from 'nylas';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

type MessageType = { role: Role, content: string };

const DRAFT_CREATION_PROMPT = `
You are an intelligent email assistant.

The user will give you emails. The emails have been sent to the user from other parties. The user needs your help replying to these emails.

Write a draft for the reply message the user can send to the original sender. Only include the body of the email.

Format your response in plain text only.
`;

const createDraftBody = async (userEmail: string, emailsInThread: Message[]) => {
  const emailThreadCopy: Message[] = JSON.parse(JSON.stringify(emailsInThread));
  emailThreadCopy.sort((a, b) => a.date - b.date);

  const messages: MessageType[] = emailThreadCopy.map(message => {
    if (message.from?.map(sender => sender.email).includes(userEmail)) {
      return { "role": Role.ASSISTANT, "content": message.body || '' };
    }

    return { "role": Role.USER, "content": message.body || '' };
  });
  const allMessages: MessageType[] = [{ "role": Role.SYSTEM, "content": DRAFT_CREATION_PROMPT }].concat(messages);
  const result = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: allMessages
  });

  return result.choices[0].message.content || '';
};

export { createDraftBody }