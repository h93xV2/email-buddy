import { createHmac } from "crypto";

export async function GET(request: Request) {
  const challenge = new URL(request.url).searchParams.get('challenge');

  if (challenge) {
    console.log(`Received Nylas challenge code - ${challenge}`);
    console.log(`Returning Nylas challenge code - ${challenge}`);

    return Response.json(challenge);
  }

  return new Response('Invalid request', {status: 400});
}

export async function POST(request: Request) {
  const nylasSignature = 'x-nylas-signature';
  const hashAlgorithm = 'sha256';
  const webhookSecret = process.env.NYLAS_WEBHOOK_SECRET;
  const signature = request.headers.get(nylasSignature);
  
  if (webhookSecret) {
    const data = (await request.json()).data;
    const digest = createHmac(hashAlgorithm, webhookSecret).update(data).digest('hex');
    const isValidWebhook = digest === nylasSignature;

    console.log({isValidWebhook});
  }

  return new Response();
}