import * as React from "react";
import { Message, User } from "@prisma/client";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";

const MessageList: React.FC<{
  messages: Message[];
  sender: User;
  users: User[];
  socket: Socket;
}> = ({ messages, sender, users, socket }) => {
  const [forwardMessages, setForwardMessages] = React.useState<String[]>([]);
  const [forwardUsers, setForwardUsers] = React.useState<String[]>([]);
  const [forward, setForward] = React.useState(false);
  const [showUsers, setShowUsers] = React.useState(false);
  const router = useRouter();

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
  };

  const handleUsersCheck: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.checked) {
      setForwardUsers((prev) => [...prev, event.target.value]);
    } else {
      setForwardUsers((prev) => prev.filter((id) => id !== event.target.value));
    }
    console.log(forwardUsers);
  };

  const handleFoward = () => {
    setShowUsers(true);
  };

  const submitForward = async () => {
    if (socket) {
      socket.emit(
        "forward",
        {
          messages: forwardMessages
            .sort((a, b) => +a.split(",")[0] - +b.split(",")[0])
            .map((a) => a.split(",")[1]),
          users: forwardUsers,
        },
        (response: any) => {
          if (response.status) {
            router.push("/users");
          }
        }
      );
    }
  };

  return (
    <div>
      {forward && (
        <button type="button" onClick={handleFoward}>
          forward
        </button>
      )}
      {showUsers && (
        <div>
          <button type="button" onClick={submitForward}>
            Submit
          </button>
          <div>
            {users.map(({ id, username }) => (
              <label key={id}>
                {username}
                <input type="checkbox" value={id} onChange={handleUsersCheck} />
              </label>
            ))}
          </div>
        </div>
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
