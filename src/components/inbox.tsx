'use client';

import { EmailName, Folder, Message, type Thread } from "nylas";
import React, { useEffect, useRef, useState } from "react";
import 'quill/dist/quill.snow.css';
import type Quill from "quill";
import Editor from "./editor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Folders from "./folders";
import Threads from "./threads";
import getTo from "@/app/utils/get-to";

type Props = {
  grantId: string,
  activeFolder: string,
  userEmail?: EmailName
};

const getFolders = async (grantId: string) => {
  return await (await fetch(`/api/folders?grantId=${grantId}`)).json();
};

const getThreads = async (grantId: string, activeFolderId?: string) => {
  if (activeFolderId) {
    return await (await fetch(`/api/threads?grantId=${grantId}&folderId=${activeFolderId}`)).json();
  }

  return [];
};

const getMessages = async (grantId: string, thread?: Thread) => {
  if (thread) {
    return await (await fetch(`/api/messages?grantId=${grantId}&threadId=${thread.id}`)).json();
  }

  return [];
};

export default function Inbox(props: Props) {
  const grantId = props.grantId;
  const queryClient = useQueryClient();
  const [activeFolder, setActiveFolder] = useState(props.activeFolder);
  const folderQueryResult = useQuery<Folder[]>({
    queryKey: ['folders', grantId],
    queryFn: async () => await getFolders(grantId),
    refetchInterval: 10000
  });
  const folders = folderQueryResult.data ?? [];
  const activeFolderId = folders.find(folder => folder.name === activeFolder)?.id;
  const threadsQueryResult = useQuery<Thread[]>({
    queryKey: ['threads', grantId, activeFolderId],
    queryFn: () => getThreads(grantId, activeFolderId),
    enabled: !!activeFolderId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 10000
  });
  const threads = threadsQueryResult.data ?? [];
  const [activeThread, setActiveThread] = useState<Thread | undefined>();
  const messagesQueryResult = useQuery<Message[]>({
    queryKey: ['messages', grantId, activeThread],
    queryFn: () => getMessages(grantId, activeThread),
    enabled: !!activeThread,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const messages = messagesQueryResult.data ?? [];
  const quillRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const threadData = {
    subject: activeThread?.subject,
    messages,
    to: getTo(messages, props.userEmail),
    grantId,
    userEmail: props.userEmail
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
      <div className="column is-one-third">
        <div className="columns is-gapless">
          <div className="column is-narrow">
            <Folders
              folders={folders}
              activeFolder={activeFolder}
              onClick={(folder) => setActiveFolder(folder.name)}
            />
          </div>
          <div className="column full-height-column is-overflow-y-auto">
            <Threads
              threads={threads}
              userEmail={props.userEmail}
              onClick={(thread) => setActiveThread(thread)}
              grantId={grantId}
            />
          </div>
        </div>
      </div>
      <div className="column full-height-column p-5 is-flex is-flex-direction-column messages-and-editor">
        <div className='is-flex-grow-1 messages is-overflow-y-auto'>
          <div className="fixed-grid has-1-cols">
            <div className="grid p-2">
              {messages.map((message, index) => {
                console.log(message);
                return <div className="cell" key={index}>
                  <p><b>{"From: "}</b>{message.from && message.from.map(from => from.email).join(",")}</p>
                  <p><b>{"To: "}</b>{message.to.map(from => from.email).join(",")}</p>
                  <p><b>{"Subject: "}</b>{message.subject ?? ''}</p>
                  <p>
                    <b>{"Date: "}</b>
                    {new Date(message.date * 1000).toLocaleString('en-US', { timeZoneName: 'short' })}
                  </p>
                  <div className="mt-3" dangerouslySetInnerHTML={{ __html: message.body as string }} />
                  {index < messages.length - 1 && <hr />}
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="is-align-content-end editor-container">
          <Editor
            quill={quill}
            quillRef={quillRef}
            threadData={threadData}
            refresh={async () => {
              await folderQueryResult.refetch();
              await queryClient.invalidateQueries({
                queryKey: ['threads', grantId, activeFolderId]
              });
              await queryClient.invalidateQueries({
                queryKey: ['messages', grantId, activeThread]
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}