'use client';

import { ThreadData } from "@/types";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  threadData: ThreadData | null,
  getBody: () => string | undefined,
  refresh: () => Promise<void>
}

export default function SendEmail({ threadData, getBody, refresh }: Props) {
  const sendEmail = (button: HTMLButtonElement, threadData: ThreadData | null) => {
    button.classList.add('is-loading');

    fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        grantId: threadData?.grantId,
        body: getBody(),
        subject: threadData?.subject,
        to: threadData?.to,
        from: [threadData?.userEmail]
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