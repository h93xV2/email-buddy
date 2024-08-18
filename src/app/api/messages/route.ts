import {getMessagesInThread, sendEmail} from "@/nylas";

export async function GET(request: Request) {
  const threadId = new URL(request.url).searchParams.get('threadId');
  
  if (threadId) {
    try {
      const messages = (await getMessagesInThread(threadId)).data;
      const data = JSON.stringify(messages);
    
      return Response.json(data);
    } catch (error) {
      console.error(error);

      return new Response('Something went wrong', {status: 502});
    }
  }

  return new Response("Missing thread ID", {status: 400});
}

export async function POST(request: Request) {
  const {to, subject, body} = await request.json();

  try {
    const sendMessage = await sendEmail({to, subject, body});
    const data = JSON.stringify(sendMessage);

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return new Response('Something went wrong', {status: 502});
  }
}