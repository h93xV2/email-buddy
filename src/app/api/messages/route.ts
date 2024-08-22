import {getMessagesInThread, sendEmail} from "@/nylas";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const threadId = url.searchParams.get('threadId');
  const grantId = url.searchParams.get('grantId');
  
  if (threadId && grantId) {
    try {
      const messages = (await getMessagesInThread(grantId, threadId)).data;
      const data = JSON.stringify(messages);
    
      return Response.json(data);
    } catch (error) {
      console.error(error);

      return new Response('Something went wrong', {status: 502});
    }
  }

  return new Response("Missing thread ID or grant ID", {status: 400});
}

export async function POST(request: Request) {
  const {to, subject, body, grantId} = await request.json();

  try {
    const sendMessage = await sendEmail(grantId, {to, subject, body});
    const data = JSON.stringify(sendMessage);

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return new Response('Something went wrong', {status: 502});
  }
}