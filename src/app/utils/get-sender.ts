import { Draft, EmailName, Message } from "nylas";

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

export default getSender;