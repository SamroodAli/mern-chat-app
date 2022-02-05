import * as React from "react";
import { Message, User } from "@prisma/client";

const MessageList: React.FC<{ messages: Message[]; sender: User }> = ({
  messages,
  sender,
}) => {
  const [forwardMessages, setForwardMessages] = React.useState<String[]>([]);
  const [forwardUsers, setForwardUsers] = React.useState<User[]>([]);
  const [forward, setForward] = React.useState(false);

  React.useEffect(() => {
    if (forwardMessages.length) {
      setForward(true);
    } else {
      setForward(false);
    }
  }, [forwardMessages.length]);

  const handleCheck: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.checked) {
      setForwardMessages((prev) => [...prev, event.target.value]);
    } else {
      setForwardMessages((prev) =>
        prev.filter((message) => message !== event.target.value)
      );
    }
    console.log(forwardMessages);
  };

  const handleForward: React.MouseEventHandler<HTMLButtonElement> = (e) => {};

  return (
    <div>
      {forward && (
        <button type="button" onClick={handleForward}>
          forward
        </button>
      )}
      <ul style={{ backgroundColor: "lightblue" }}>
        {messages.map(({ id, content, senderId }, index) => (
          <li
            key={id}
            style={{
              color: senderId === sender?.id ? "green" : "red",
              padding: "0.2rem",
              margin: "0.2rem",
              textAlign: senderId === sender?.id ? "right" : "left",
            }}
          >
            <label htmlFor={id}>
              {content}
              <input
                type="checkbox"
                id={id}
                name="vehicle1"
                value={[index.toString(), content]}
                onChange={handleCheck}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(MessageList);
