import {getMessagesInThread} from "@/nylas";

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