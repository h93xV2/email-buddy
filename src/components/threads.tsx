'use client';

import getSender from "@/app/utils/get-sender";
import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmailName, Thread } from "nylas";

type Props = {
  threads: Thread[],
  userEmail?: EmailName,
  grantId: string
  onClick: (thread: Thread) => void
};

export default function Threads({ threads, userEmail, onClick, grantId }: Props) {
  threads.sort((a, b) => b.latestMessageReceivedDate - a.latestMessageReceivedDate);

  return (
    <div className="fixed-grid has-1-cols">
      <div className="grid p-2">
        {
          threads.map((thread, index) => {
            const sender = getSender(thread.latestDraftOrMessage, userEmail);

            return (
              <div className="cell thread-cell" key={index}>
                <div className="email-thread-item is-clickable p-2" onClick={() => {
                  onClick(thread);
                  if (thread.unread) {
                    fetch(`/api/threads`, { method: 'PUT', body: JSON.stringify({ threadId: thread.id, grantId }) })
                      .then(() => onClick(thread));
                  }
                }}>
                  <div className="columns is-gapless">
                    <div className="column is-11">
                      <p className="grid">
                        <span className="cell is-size-5 has-text-weight-bold">
                          {sender}
                        </span>
                        <span className="cell has-text-right is-size-7">
                          {
                            new Date(thread.latestMessageReceivedDate * 1000)
                              .toLocaleString('en-US', { timeZoneName: 'short' })
                          }
                        </span>
                      </p>
                      <p className="is-size-6">{thread.subject}</p>
                      <p className="is-size-7">{thread.snippet?.substring(0, 100) + "..."}</p>
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
  );
}