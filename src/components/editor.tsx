'use client';

import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreadData } from "@/types";
import Quill from "quill";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SendEmail from "./send-email";
import SaveDraft from "./save-draft";
import GenerateDraft from "./generate-draft";

type Props = {
  quill: Quill | null,
  quillRef: React.RefObject<HTMLDivElement>,
  threadData: ThreadData,
  refresh: () => Promise<void>,
  showButtons: boolean
};

const toggleEditorControls = (setIsEditorControlsVisible: Dispatch<SetStateAction<boolean>>) => {
  const editorControls = document.getElementById('editor-controls');
  const classList = editorControls?.classList;

  if (classList) {
    setIsEditorControlsVisible(classList.contains('is-hidden'));

    classList.toggle('is-hidden');
  }
};

export default function Editor({ quill, quillRef, threadData, refresh, showButtons }: Props) {
  const {to, isNoReply} = threadData;
  const [isEditorControlsVisible, setIsEditorControlsVisible] = useState(true);

  useEffect(() => {
    document.getElementById('no-reply-warning')?.classList.remove('is-hidden');
  }, [isNoReply]);

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
                disabled={true}
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
        {
          isNoReply && isNoReply.isNoReply && (
            <div className="notification is-warning mt-3" id="no-reply-warning">
              <button
                className="delete"
                onClick={(e) => e.currentTarget.parentElement?.classList.add('is-hidden')}
              ></button>
              <p><b>Reply may not be necessary!</b></p>
              {isNoReply.explanation}
            </div>
          )
        }
        <div className='pb-2 pt-2 buttons is-right'>
          <GenerateDraft quill={quill} threadData={threadData} />
          <SaveDraft
            threadData={threadData}
            getBody={() => quill?.getText()}
            isDisabled={!threadData.subject && !threadData.to && quill?.getText().trim() === ""}
            refresh={refresh}
          />
          <SendEmail
            threadData={threadData}
            getBody={() => quill?.getSemanticHTML()}
            refresh={refresh}
            isDisabled={!showButtons}
          />
        </div>
      </div>
    </div>
  );
}