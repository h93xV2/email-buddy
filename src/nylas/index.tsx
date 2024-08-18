import Nylas, { CreateDraftRequest, SendMessageRequest } from 'nylas';

const NylasConfig = {
  apiKey: process.env.NYLAS_API_KEY as string,
  apiUri: process.env.NYLAS_API_URI as string,
};

const nylas = new Nylas(NylasConfig);

const fetchRecentThreads = async () => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const threads = await nylas.threads.list({
    identifier
  });

  return threads;
};

const getThreadsByFolderId = async (folderId: string) => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const threads = await nylas.threads.list({
    identifier,
    queryParams: {
      in: [folderId]
    }
  });

  return threads;
};

const getMessagesInThread = async (threadId: string) => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const result = await nylas.messages.list({
    identifier,
    queryParams: {
      threadId
    }
  });

  return result;
};

const getFolders = async () => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const folders = await nylas.folders.list({
    identifier
  });

  return folders;
};

const sendEmail = async (sendMessageRequest: SendMessageRequest) => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const sendMessage = await nylas.messages.send({
    identifier,
    requestBody: sendMessageRequest
  });

  return sendMessage;
};

const createDraft = async (draft: CreateDraftRequest) => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const createDraft = await nylas.drafts.create({
    identifier,
    requestBody: draft
  });

  return createDraft;
};

export { fetchRecentThreads, getMessagesInThread, getFolders, getThreadsByFolderId, sendEmail, createDraft }