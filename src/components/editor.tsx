'use client';

import { faEnvelope, faFloppyDisk, faPaperPlane, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreadData } from "@/components/types";
import Quill from "quill";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { EmailName } from "nylas";

type Props = {
  grantId: string,
  quill: Quill | null,
  quillRef: React.RefObject<HTMLDivElement>,
  threadData: ThreadData | null,
  userEmail?: EmailName
};

type DraftResult = {
  body: string
};

const toggleEditorControls = (setIsEditorControlsVisible: Dispatch<SetStateAction<boolean>>) => {
  const editorControls = document.getElementById('editor-controls');
  const classList = editorControls?.classList;

  if (classList) {
    setIsEditorControlsVisible(classList.contains('is-hidden'));

    classList.toggle('is-hidden');
  }
};

export default function Editor({ grantId, quill, quillRef, threadData, userEmail }: Props) {
  const to = threadData?.to;
  const [isEditorControlsVisible, setIsEditorControlsVisible] = useState(true);
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
  const saveDraft = (button: HTMLButtonElement, threadData: ThreadData | null) => {
    button.classList.add('is-loading');

    fetch('/api/drafts', {
      method: 'POST',
      body: JSON.stringify({ grantId, body: quill?.getText(), subject: threadData?.subject, to })
    }).finally(() => {
      button.classList.remove('is-loading');
    });
  };
  const sendEmail = (button: HTMLButtonElement, threadData: ThreadData | null) => {
    button.classList.add('is-loading');

    fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ grantId, body: quill?.getText(), subject: threadData?.subject, to, from: [userEmail] })
    }).finally(() => {
      button.classList.remove('is-loading');
    });
  };

  return (
    <div className='pt-4 pl-6 pr-6 pb-5'>
      <div className="is-flex is-justify-content-end">
        <button className="button" onClick={() => toggleEditorControls(setIsEditorControlsVisible)}>
          {
            isEditorControlsVisible && <FontAwesomeIcon icon={faChevronDown} />
          }
          {
            !isEditorControlsVisible && <FontAwesomeIcon icon={faChevronUp} />
          }
        </button>
      </div>
      <div id="editor-controls">
        <div className="mb-3">
          <div className="field mb-1">
            <label className="label">To</label>
            <div className="control control has-icons-left">
              <input
                className="input"
                type="email"
                placeholder="Email"
                defaultValue={to?.map(emailName => emailName.email)}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Subject</label>
            <div className="control">
              <input className="input" type="text" placeholder="Subject" defaultValue={threadData?.subject} />
            </div>
          </div>
        </div>
        <div ref={quillRef} style={{ minHeight: '200px' }} />
        <div className='pb-2 pt-2 buttons is-right'>
          {threadData && (
            <button
              className='button is-link'
              onClick={(e) => { if (threadData?.messages) generateDraft(e.currentTarget, threadData) }}
            >
              {"Generate Draft"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
          <button className="button is-secondary" onClick={(e) => saveDraft(e.currentTarget, threadData)}>
            {"Save Draft"}&nbsp;&nbsp;<FontAwesomeIcon icon={faFloppyDisk} />
          </button>
          <button className='button is-primary' onClick={(e) => sendEmail(e.currentTarget, threadData)}>
            {"Send"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}