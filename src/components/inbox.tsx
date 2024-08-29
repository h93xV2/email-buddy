'use client';

import { EmailName, Folder, Message, type Thread } from "nylas";
import React, { useEffect, useRef, useState } from "react";
import 'quill/dist/quill.snow.css';
import type Quill from "quill";
import { ThreadData } from "@/types";
import Editor from "./editor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Folders from "./folders";
import Threads from "./threads";

type Props = {
  grantId: string,
  activeFolder: string,
  userEmail?: EmailName
};

export default function Inbox(props: Props) {
  const grantId = props.grantId;
  const queryClient = useQueryClient();
  const [activeFolder, setActiveFolder] = useState(props.activeFolder);
  const folderQueryResult = useQuery<Folder[]>({
    queryKey: ['folders', grantId],
    queryFn: async () => await (await fetch(`/api/folders?grantId=${grantId}`)).json()
  });
  const folders = folderQueryResult.data;
  const activeFolderId = folders?.find(folder => folder.name === activeFolder)?.id;
  const threadsQueryResult = useQuery<Thread[]>({
    queryKey: ['threads', grantId, activeFolderId],
    queryFn: async () => await (await fetch(`/api/threads?grantId=${grantId}&folderId=${activeFolderId}`)).json(),
    enabled: !!activeFolderId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const threads = threadsQueryResult.data;
  const [threadData, setThreadData] = useState<ThreadData | null>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const updateThreadsForFolder = (folder: Folder) => {
    setActiveFolder(folder.name);
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
              onClick={(folder) => updateThreadsForFolder(folder)}
            />
          </div>
          <div className="column full-height-column is-overflow-y-auto">
            <Threads
              threads={threads}
              grantId={grantId}
              setThreadData={setThreadData}
              userEmail={props.userEmail}
              quill={quill}
              refresh={async () => {
                await folderQueryResult.refetch();
                await queryClient.invalidateQueries({
                  queryKey: ['threads', grantId, activeFolderId]
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="column full-height-column p-5 is-flex is-flex-direction-column messages-and-editor">
        <div className='is-flex-grow-1 messages is-overflow-y-auto'>
          <div className="fixed-grid has-1-cols">
            <div className="grid p-2">
              {threadData?.messages.map((message, index) => {
                return <div className="cell" key={index}>
                  <div dangerouslySetInnerHTML={{ __html: message.body as string }} />
                  {index < threadData.messages.length - 1 && <hr />}
                </div>
              })}
            </div>
          </div>
        </div>
        <div className="is-align-content-end editor-container">
          <Editor
            grantId={props.grantId}
            quill={quill}
            quillRef={quillRef}
            threadData={threadData}
            userEmail={props.userEmail}
            refresh={async () => {
              await folderQueryResult.refetch();
              await queryClient.invalidateQueries({
                queryKey: ['threads', grantId, activeFolderId]
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}