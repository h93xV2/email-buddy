import { EmailName, Message } from "nylas";

const getTo = (messages: Message[], userEmail?: EmailName): EmailName[] | undefined => {
  const latestInboundMessage = messages.find(message => message.object === 'message'
    && userEmail && message.to.map(recipient => recipient.email).includes(userEmail.email));

  let to = undefined;

  if (latestInboundMessage) {
    if (latestInboundMessage.replyTo && latestInboundMessage.replyTo.length > 0) {
      to = latestInboundMessage.replyTo;
    } else {
      to = latestInboundMessage.from;
    }
  }

  return to;
};

export default getTo;