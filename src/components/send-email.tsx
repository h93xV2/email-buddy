'use client';

import { ThreadData } from "@/types";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Message } from "nylas";

type Props = {
  threadData: ThreadData | null,
  getBody: () => string | undefined,
  refresh: () => Promise<void>,
  isDisabled: boolean
}

export default function SendEmail({ threadData, getBody, refresh, isDisabled }: Props) {
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
    <button
      className={`button is-primary${isDisabled ? ' is-loading' : ''}`}
      onClick={(e) => sendEmail(e.currentTarget, threadData)}
      disabled={isDisabled}
    >
      {"Send"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPaperPlane} />
    </button>
  );
}