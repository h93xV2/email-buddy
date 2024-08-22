'use client';

import { Folder, type Message, type Thread } from "nylas";
import React, { useEffect, useRef, useState } from "react";
import 'quill/dist/quill.snow.css';
import type Quill from "quill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen, faPenToSquare, faPaperPlane, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope as faEnvelopeSolid } from "@fortawesome/free-solid-svg-icons";

type Props = {
  threads: Thread[],
  folders: Folder[],
  grantId?: string
};

type DraftResult = {
  body: string
};

type ThreadData = {
  subject?: string,
  messages: Message[],
  to?: string[]
};

export default function Inbox(props: Props) {
  const { threads, folders, grantId } = props;

  const [threadData, setThreadData] = useState<ThreadData | null>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const retrieveMessages = (thread: Thread) => {
    const query = new URLSearchParams({ threadId: thread.id });

    fetch(`/api/messages?${query}`)
      .then((response) => {
        response.json().then(json => {
          const messages: Message[] = JSON.parse(json);
          const to = messages.sort((a, b) => b.date - a.date);

          setThreadData({ subject: thread.subject, messages: JSON.parse(json) });

          if (quill) {
            quill.setText("");
          }
        });
      });
  };
  const sendMessage = () => {

  };

  useEffect(() => {
    const currentRef = quillRef.current === null ? '' : quillRef.current;
    if (typeof window !== undefined && currentRef !== '' && quill === null) {
      import('quill').then(Quill => {
        const quillInstance = new Quill.default(currentRef, {
          theme: 'snow'
        });

        setQuill(quillInstance);
      });
    }
  }, [quill]);

  const generateDraft = (threadData: ThreadData) => {
    const messages = threadData.messages;
    const messagesAsStrings = messages.map(message => message.body).filter(message => message !== undefined);

    fetch('/api/drafts', {
      method: 'POST',
      body: JSON.stringify({ messages: messagesAsStrings, subject: threadData.subject, to: threadData.to })
    }).then(response => {
      response.json().then((result: DraftResult) => {
        if (quill) {
          quill.setText(result.body);
        }
      });
    });
  };

  return (
    <div className="columns is-gapless">
      <div className="column is-one-quarter">
        <div className="columns is-gapless">
          <div className="column is-one-third">
            <div className="menu pt-3 pl-3">
              <p className="menu-label">Folders</p>
              <ul className="menu-list">
                {
                  folders.map((folder, index) => {
                    if (folder.attributes && folder.attributes.length > 0) {
                      return <li key={index}><a className={folder.name === 'INBOX' ? 'is-active' : ''}>
                        {`${folder.attributes[0].replace("\\", "")} (${folder.totalCount})`}
                      </a></li>
                    }
                  })
                }
              </ul>
            </div>
          </div>
          <div className="column full-height-column is-overflow-y-auto">
            <div className="fixed-grid has-1-cols">
              <div className="grid p-2">
                {
                  threads.map((thread, index) => {
                    return <div className="cell" key={index}>
                      <div className="email-thread-item p-1" onClick={() => retrieveMessages(thread)}>
                        <div className="columns is-gapless">
                          <div className="column is-11">
                            <p><b>{thread.subject}</b></p>
                            <p>{thread.snippet?.substring(0, 20) + "..."}</p>
                          </div>
                          <div className="column">
                            <div className="is-flex is-justify-content-end pr-2 pt-2">
                              <FontAwesomeIcon
                                icon={thread.unread ? faEnvelopeSolid : faEnvelopeOpen}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="column full-height-column p-5 is-flex is-flex-direction-column">
        <div className='is-flex-grow-1 messages is-overflow-y-auto'>
          <div className="fixed-grid has-1-cols">
            <div className="grid p-2">
              {threadData?.messages.map((message, index) => {
                return <div className="cell" key={index}>
                  <div dangerouslySetInnerHTML={{ __html: message.body as string }} />
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="is-align-content-end editor-container">
          <div className='pt-4 pl-6 pr-6 pb-5'>
            <div className="mb-2">
              <div className="field mb-1">
                <label className="label">To</label>
                <div className="control control has-icons-left">
                  <input className="input" type="email" placeholder="Email" />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Subject</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Subject" value={threadData?.subject} />
                </div>
              </div>
            </div>
            <div ref={quillRef} style={{ minHeight: '200px' }} />
            <div className='pb-2 pt-2 buttons is-right'>
              {threadData && (
                <button
                  className='button is-link'
                  onClick={() => { if (threadData?.messages) generateDraft(threadData) }}
                >
                  {"Generate Draft"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPenToSquare} />
                </button>
              )}
              <button className='button is-primary'>
                {"Send"}&nbsp;&nbsp;<FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}