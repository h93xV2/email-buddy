'use client';

import { type Message, type Thread } from "nylas";
import React, { useEffect, useRef, useState } from "react";
import 'quill/dist/quill.snow.css';
import type Quill from "quill";

type Props = {
  threads: Thread[]
};

export default function Inbox(props: Props) {
  const {threads} = props;
  const [messages, setMessages] = useState<Message[]>([]);
  const retrieveMessages = (threadId: string) => {
    const query = new URLSearchParams({threadId});

    fetch(`/api/messages?${query}`)
    .then((response) => {
      response.json().then(json => {
        setMessages(JSON.parse(json));
      });
    })
  };

  const quillRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

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
  }, [quill])

  return (
    <div className="columns is-gapless">
      <div className="column is-one-third full-height-column is-overflow-y-auto">
        <div className="fixed-grid has-1-cols">
          <div className="grid p-2">
            {threads.map((thread, index) => {
              return <div className="cell" key={index}>
                <div className="email-thread-item p-1" onClick={() => retrieveMessages(thread.id)}>
                  <p><b>{thread.subject}</b></p>
                  <p>{thread.snippet?.substring(0, 100) + "..."}</p>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
      <div className="column full-height-column p-5 is-flex is-flex-direction-column">
        <div className='is-flex-grow-1 messages is-overflow-y-auto'>
          <div className="fixed-grid has-1-cols">
            <div className="grid">
              {messages.map((message, index) => {
                return <div className="cell" key={index}>
                  <div dangerouslySetInnerHTML={{__html: message.body as string}} />
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="is-align-content-end .editor-container">
          <div className='p-3'>
            <div ref={quillRef} style={{minHeight: '300px'}} />
            <div className='pb-2 pt-2 buttons is-right'>
              <button className='button is-primary'>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}