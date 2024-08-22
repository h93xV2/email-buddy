import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const DRAFT_CREATION_PROMPT = `
You are an intelligent email assistant.

The user will give you emails. The emails have been sent to the user from other parties. The user needs your help replying to these emails.

Write a draft for the reply message the user can send to the original sender. Only include the body of the email.
`;

const createDraftBody = async (emailsInThread: string[]) => {
  const result = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { "role": "system", "content": DRAFT_CREATION_PROMPT },
      { "role": "user", "content": JSON.stringify(emailsInThread) }
    ]
  });

  return result.choices[0].message.content || '';
};

export { createDraftBody }