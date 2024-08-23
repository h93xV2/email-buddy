'use client';

import { Folder, type Message, type Thread } from "nylas";
import React, { useEffect, useRef, useState } from "react";
import 'quill/dist/quill.snow.css';
import type Quill from "quill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ThreadData } from "@/components/types";
import Editor from "./editor";

type Props = {
  threads: Thread[],
  folders: Folder[],
  grantId: string,
  activeFolder: string
};

export default function Inbox(props: Props) {
  const [activeFolder, setActiveFolder] = useState(props.activeFolder);
  const [threads, setThreads] = useState(props.threads);
  const [threadData, setThreadData] = useState<ThreadData | null>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const retrieveMessages = (thread: Thread) => {
    const query = new URLSearchParams({ threadId: thread.id, grantId: props.grantId });

    fetch(`/api/messages?${query}`)
      .then((response) => {
        response.json().then(json => {
          const messages: Message[] = JSON.parse(json);
          const to = messages.sort((a, b) => b.date - a.date);

          // Add a check for do-not reply type emails
          setThreadData({ subject: thread.latestDraftOrMessage.subject, messages: JSON.parse(json) });

          if (quill) {
            quill.setText("");
          }
        });
      });
  };
  const updateThreadsForFolder = (folder: Folder) => {
    setActiveFolder(folder.name);
    document.querySelectorAll('.thread-cell').forEach(element => element.classList.add('is-skeleton'));

    fetch(`/api/threads?folderId=${folder.id}&grantId=${props.grantId}`).then(response => {
      response.json().then(newThreads => {
        setThreads(newThreads);
        document.querySelectorAll('.thread-cell').forEach(element => element.classList.remove('is-skeleton'));
      });
    });
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

  return (
    <div className="columns is-gapless">
      <div className="column is-one-quarter">
        <div className="columns is-gapless">
          <div className="column is-one-third">
            <div className="menu pt-3 pl-3">
              <p className="menu-label">Folders</p>
              <ul className="menu-list">
                {
                  props.folders.map((folder, index) => {
                    if (folder.attributes && folder.attributes.length > 0) {
                      return (
                        <li key={index}>
                          <a
                            className={folder.name === activeFolder ? 'is-active' : ''}
                            onClick={() => updateThreadsForFolder(folder)}
                          >
                            {`${folder.attributes[0].replace("\\", "")} (${folder.totalCount})`}
                          </a>
                        </li>
                      );
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
                    return (
                      <div className="cell thread-cell" key={index}>
                        <div className="email-thread-item is-clickable p-1" onClick={() => retrieveMessages(thread)}>
                          <div className="columns is-gapless">
                            <div className="column is-11">
                              <p><b>{thread.subject}</b></p>
                              <p>{thread.snippet?.substring(0, 20) + "..."}</p>
                            </div>
                            <div className="column">
                              <div className="is-flex is-justify-content-end pr-2 pt-2">
                                <FontAwesomeIcon
                                  icon={thread.unread ? faEnvelope : faEnvelopeOpen}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
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
          <Editor grantId={props.grantId} quill={quill} quillRef={quillRef} threadData={threadData} />
        </div>
      </div>
    </div>
  );
}