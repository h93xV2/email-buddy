'use client';

import { ThreadData } from "@/types";
import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Draft, EmailName, Message, Thread } from "nylas";
import Quill from "quill";

type Props = {
  threads?: Thread[],
  grantId: string,
  setThreadData: React.Dispatch<React.SetStateAction<ThreadData | null>>,
  userEmail?: EmailName,
  quill: Quill | null,
  refresh: () => Promise<void>
}

const getSender = (latestDraftOrMessage: Message | Draft, userEmail?: EmailName) => {
  const latestReplyTo = latestDraftOrMessage.replyTo;
  const from = latestDraftOrMessage.from;

  let possibleSender = latestReplyTo && latestReplyTo.length > 0 ? latestReplyTo : latestDraftOrMessage.to;

  if (possibleSender && userEmail && !possibleSender.map(sender => sender.email).includes(userEmail.email)) {
    const senderName = possibleSender[0].name;

    return senderName ? senderName : possibleSender[0].email;
  }

  if (from) {
    const fromName = from[0].name;

    return fromName ? fromName : from[0].email;
  }

  return undefined;
};

const getTo = (messages: Message[], userEmail?: EmailName): EmailName[] | undefined => {
  const latestInboundMessage = messages.find(message => message.object === 'message'
    && userEmail && !message.to.map(recipient => recipient.email).includes(userEmail.email));

  let to = undefined;

  if (latestInboundMessage) {
    if (latestInboundMessage.replyTo && latestInboundMessage.replyTo.length > 0) {
      to = latestInboundMessage.replyTo;
    } else if (latestInboundMessage.to && latestInboundMessage.to.length > 0) {
      to = latestInboundMessage.to;
    } else {
      to = latestInboundMessage.from;
    }
  }

  return to;
};

export default function Threads({threads, grantId, setThreadData, userEmail, quill, refresh}: Props) {
  threads?.sort((a, b) => b.latestMessageReceivedDate - a.latestMessageReceivedDate);

  const retrieveMessages = (thread: Thread) => {
    const query = new URLSearchParams({ threadId: thread.id, grantId });

    fetch(`/api/messages?${query}`)
      .then((response) => {
        response.json().then(json => {
          const to = getTo(JSON.parse(json), userEmail);

          // Add a check for do-not reply type emails
          setThreadData({
            subject: thread.latestDraftOrMessage.subject,
            messages: JSON.parse(json),
            to,
            userEmail: userEmail,
            grantId: grantId
          });

          if (quill) {
            quill.setText("");
          }

          // TODO: Update the read icon of the thread
          if (thread.unread) {
            fetch(`/api/threads`, {method: 'PUT', body: JSON.stringify({threadId: thread.id, grantId})})
              .then(async () => await refresh());
          }
        });
      });
  };

  return (
    <div className="fixed-grid has-1-cols">
      <div className="grid p-2">
        {
          threads?.map((thread, index) => {
            const sender = getSender(thread.latestDraftOrMessage, userEmail);

            return (
              <div className="cell thread-cell" key={index}>
                <div className="email-thread-item is-clickable p-2" onClick={() => retrieveMessages(thread)}>
                  <div className="columns is-gapless">
                    <div className="column is-11">
                      <p className="grid">
                        <span className="cell is-size-5 has-text-weight-bold">
                          {sender}
                        </span>
                        <span className="cell has-text-right is-size-7">
                          {
                            new Date(thread.latestMessageReceivedDate*1000)
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