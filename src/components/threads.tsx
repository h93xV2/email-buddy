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

const defaultText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a odio consectetur, varius dui sed, consequat
  ante. Aenean ut malesuada erat, feugiat euismod lectus. Integer at imperdiet enim. Vestibulum rutrum felis vel tellus
  sollicitudin elementum. Vivamus tempor, dolor vitae vestibulum tincidunt, nunc est malesuada arcu, ut porta lectus
  dolor non libero. Quisque vulputate, ex condimentum luctus rhoncus, ligula mi cursus risus, sit amet hendrerit nulla
  leo ac eros. Cras at imperdiet orci, nec consequat nisl.
`;

const skeletonCell = (
  <div className="cell thread-cell is-skeleton">
    {defaultText}
  </div>
);

export default function Threads({ threads, userEmail, onClick, grantId }: Props) {
  threads.sort((a, b) => b.latestMessageReceivedDate - a.latestMessageReceivedDate);

  let skeletonCells = [];

  if (threads.length === 0) {
    for (let i = 0; i < 5; i ++) {
      skeletonCells.push(skeletonCell);
    }
  }

  return (
    <div className="fixed-grid has-1-cols">
      <div className="grid p-2">
        {
          threads.length === 0 && skeletonCells.map((skeleton, key) => <div key={key}>{skeleton}</div>)
        }
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