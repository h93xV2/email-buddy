// Can't use the Nylas SDK for this because it uses crypto and crypto isn't available in middleware.ts
const exchangeCodeForGrant = async (code: string): Promise<string> => {
  const body = JSON.stringify({
    client_id: process.env.NYLAS_CLIENT_ID,
    client_secret: process.env.NYLAS_API_KEY,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.NYLAS_REDIRECT_URI,
    code_verifier: "nylas"
  });
  const response = await fetch(`${process.env.NYLAS_API_URI}/v3/connect/token`, {
    method: "POST",
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const json = await response.json();
  const grantId = json.grant_id;

  return grantId;
};

export {exchangeCodeForGrant}