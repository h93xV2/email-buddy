'use client';

import { ThreadData } from "@/types";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Message } from "nylas";

type Props = {
  threadData: ThreadData | null,
  getBody: () => string | undefined,
  refresh: () => Promise<void>
}

export default function SendEmail({ threadData, getBody, refresh }: Props) {
  const sendEmail = (button: HTMLButtonElement, threadData: ThreadData | null) => {
    button.classList.add('is-loading');

    const messages: Message[] = JSON.parse(JSON.stringify(threadData?.messages ?? []));

    let replyToMessageId = undefined;

    if (messages.length > 0) {
      messages.sort((a, b) => b.createdAt - a.createdAt);

      replyToMessageId = messages[0].id;
    }

    fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        grantId: threadData?.grantId,
        body: getBody(),
        subject: threadData?.subject,
        to: threadData?.to,
        from: [threadData?.userEmail],
        replyToMessageId
      })
    }).then(async () => {
      await refresh();
    }).finally(() => {
      button.classList.remove('is-loading');
    });
  };

  return (
    <button className='button is-primary' onClick={(e) => sendEmail(e.currentTarget, threadData)}>
      {"Send"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPaperPlane} />
    </button>
  );
}