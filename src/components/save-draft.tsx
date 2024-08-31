'use client';

import { ThreadData } from "@/types";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  threadData: ThreadData | null,
  getBody: () => string | undefined,
  isDisabled: boolean,
  refresh: () => Promise<void>
}

export default function SaveDraft({ threadData, getBody, isDisabled, refresh }: Props) {
  const saveDraft = (button: HTMLButtonElement, threadData: ThreadData | null) => {
    button.classList.add('is-loading');
    button.disabled = true;

    fetch('/api/drafts', {
      method: 'POST',
      body: JSON.stringify({
        grantId: threadData?.grantId,
        body: getBody(),
        subject: threadData?.subject,
        to: threadData?.to
      })
    }).then(async () => {
      await refresh();
    }).finally(() => {
      button.classList.remove('is-loading');
      button.disabled = false;
    });
  };

  return (
    <button
      className="button is-secondary"
      onClick={(e) => saveDraft(e.currentTarget, threadData)}
      disabled={isDisabled}
    >
      {"Save Draft"}&nbsp;&nbsp;<FontAwesomeIcon icon={faFloppyDisk} />
    </button>
  );
}