import * as React from "react";
import { Message, User } from "@prisma/client";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { useEditMessages } from "../hooks";
import SenderMessage from "./SenderMessage";
import RecieverMessage from "./RecieverMessage";

const ChatList: React.FC<{
  messages: Message[];
  sender: User;
  users: User[];
  socket: Socket;
}> = ({ messages, sender, users, socket }) => {
  const {
    forwardMessages,
    forward,
    addMessage,
    removeMessage,
    showUsers,
    forwardUsers,
    completeEdit,
    selectUsers,
    addUser,
    removeUser,
  } = useEditMessages();

  const router = useRouter();

  const handleCheck: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    event.target.checked
      ? addMessage(+event.target.value)
      : removeMessage(+event.target.value);
  };

  const handleUsersCheck: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    event.target.checked
      ? addUser(event.target.value)
      : removeUser(event.target.value);
  };

  const submitForward = async () => {
    if (socket) {
      socket.emit("forward", forwardMessages, forwardUsers, (response: any) => {
        if (response.status) {
          router.push("/users");
        }
      });
    }
    completeEdit();
  };

  return (
    <div>
      {forward && (
        <button type="button" onClick={selectUsers}>
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

      {messages.map(({ id, content, senderId }) => (
        <div className="">
          {senderId === sender?.id && <SenderMessage message={content} />}
          <input
            placeholder={content}
            type="checkbox"
            name="vehicle1"
            value={id}
            onChange={handleCheck}
          />
          {senderId !== sender?.id && <RecieverMessage message={content} />}
        </div>
      ))}
    </div>
  );
};

export default React.memo(ChatList);
