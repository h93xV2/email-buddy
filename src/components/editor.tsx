'use client';

import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreadData } from "@/types";
import Quill from "quill";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState } from "react";
import SendEmail from "./send-email";
import SaveDraft from "./save-draft";
import GenerateDraft from "./generate-draft";

type Props = {
  quill: Quill | null,
  quillRef: React.RefObject<HTMLDivElement>,
  threadData: ThreadData,
  refresh: () => Promise<void>
};

const toggleEditorControls = (setIsEditorControlsVisible: Dispatch<SetStateAction<boolean>>) => {
  const editorControls = document.getElementById('editor-controls');
  const classList = editorControls?.classList;

  if (classList) {
    setIsEditorControlsVisible(classList.contains('is-hidden'));

    classList.toggle('is-hidden');
  }
};

export default function Editor({ quill, quillRef, threadData, refresh }: Props) {
  const to = threadData.to;
  const [isEditorControlsVisible, setIsEditorControlsVisible] = useState(true);

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
                onChange={(event) => {}}
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
          <GenerateDraft quill={quill} threadData={threadData} />
          <SaveDraft
            threadData={threadData}
            getBody={() => quill?.getText()}
            isDisabled={!threadData.subject && !threadData.to && quill?.getText().trim() === ""}
            refresh={refresh}
          />
          <SendEmail threadData={threadData} getBody={() => quill?.getText()} refresh={refresh} />
        </div>
      </div>
    </div>
  );
}