import Nylas from 'nylas'

const NylasConfig = {
  apiKey: process.env.NYLAS_API_KEY as string,
  apiUri: process.env.NYLAS_API_URI as string,
};

const nylas = new Nylas(NylasConfig)

const fetchRecentThreads = async () => {
  const identifier = process.env.NYLAS_TEST_GRANT as string;
  const threads = await nylas.threads.list({
    identifier
  });

  return threads;
};

const getMessagesInThread = async (threadId: string) => {
  const result = await nylas.messages.list({
    identifier: process.env.NYLAS_TEST_GRANT as string,
    queryParams: {
      threadId
    }
  });

  return result;
};

export {fetchRecentThreads, getMessagesInThread}