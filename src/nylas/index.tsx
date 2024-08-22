import Nylas, { CreateDraftRequest, SendMessageRequest } from 'nylas';

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY as string,
  apiUri: process.env.NYLAS_API_URI as string,
});

const fetchRecentThreads = async (grantId: string) => {
  const threads = await nylas.threads.list({
    identifier: grantId
  });

  return threads;
};

const getThreadsByFolderId = async (grantId: string, folderId: string) => {
  const threads = await nylas.threads.list({
    identifier: grantId,
    queryParams: {
      in: [folderId]
    }
  });

  return threads;
};

const getMessagesInThread = async (grantId: string, threadId: string) => {
  const result = await nylas.messages.list({
    identifier: grantId,
    queryParams: {
      threadId
    }
  });

  return result;
};

const getFolders = async (grantId: string) => {
  const folders = await nylas.folders.list({
    identifier: grantId
  });

  return folders;
};

const sendEmail = async (grantId: string, sendMessageRequest: SendMessageRequest) => {
  const sendMessage = await nylas.messages.send({
    identifier: grantId,
    requestBody: sendMessageRequest
  });

  return sendMessage;
};

const createDraft = async (grantId: string, draft: CreateDraftRequest) => {
  const createDraft = await nylas.drafts.create({
    identifier: grantId,
    requestBody: draft
  });

  return createDraft;
};

const getGoogleAuthUrl = async (userEmail: string) => {
  return nylas.auth.urlForOAuth2({
    clientId: process.env.NYLAS_CLIENT_ID as string,
    provider: 'google',
    redirectUri: process.env.NYLAS_REDIRECT_URI as string,
    loginHint: userEmail,
  });
};

const getGrant = async (grantId: string) => {
  const grant = await nylas.grants.find({grantId});

  return grant.data;
};

export {
  fetchRecentThreads, getMessagesInThread, getFolders, getThreadsByFolderId, sendEmail, createDraft,
  getGoogleAuthUrl, getGrant
}