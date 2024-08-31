import { DraftResult, ThreadData } from "@/types";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Quill from "quill";

type Props = {
  threadData: ThreadData,
  quill: Quill | null
};

export default function GenerateDraft({ threadData, quill }: Props) {
  const grantId = threadData.grantId;
  const generateDraft = (button: HTMLButtonElement, threadData: ThreadData) => {
    const messages = threadData.messages;

    button.classList.add('is-loading');

    fetch('/api/drafts/body', {
      method: 'POST',
      body: JSON.stringify({ grantId, messages, subject: threadData.subject, to: threadData.to })
    }).then(response => {
      response.json().then((result: DraftResult) => {
        if (quill) {
          quill.setText(result.body);
        }
      }).finally(() => button.classList.remove('is-loading'));
    });
  };

  console.log(threadData.messages);

  return (
    <button
      className='button is-link'
      onClick={(e) => { if (threadData?.messages) generateDraft(e.currentTarget, threadData) }}
      disabled={threadData.messages.length === 0}
    >
      {"Generate Draft"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
}