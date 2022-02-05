import * as React from "react";
import { Message, User } from "@prisma/client";

const MessageList: React.FC<{ messages: Message[]; sender: User }> = ({
  messages,
  sender,
}) => {
  return (
    <ul style={{ backgroundColor: "lightblue" }}>
      {messages.map(({ id, content, senderId }) => (
        <li
          key={id}
          style={{
            color: senderId === sender?.id ? "green" : "red",
            padding: "0.2rem",
            margin: "0.2rem",
            textAlign: senderId === sender?.id ? "right" : "left",
          }}
        >
          {content}
        </li>
      ))}
    </ul>
  );
};

export default React.memo(MessageList);
