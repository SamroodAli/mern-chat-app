import * as React from "react";
import { Message, User } from "@prisma/client";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { useEditMessages } from "../hooks";
import MessageContent from "./Message";

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

  const cancelForward = () => {
    completeEdit();
  };

  return (
    <div>
      {forward && (
        <button
          type="button"
          onClick={selectUsers}
          className="bg-green-300 p-3 rounded-lg hover:p-4"
        >
          forward
        </button>
      )}
      {showUsers && (
        <div>
          <button
            type="button"
            onClick={submitForward}
            className="bg-green-300 p-3 rounded-lg hover:p-4"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={cancelForward}
            className="bg-red-300 p-3 rounded-lg hover:p-4"
          >
            Cancel
          </button>
          <div className="grid">
            {users.map(({ id, username }) => (
              <label key={id} className="m-3 p-3 bg-gray-300">
                {username}
                <input
                  type="checkbox"
                  value={id}
                  onChange={handleUsersCheck}
                  className="mx-2"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col h-chat_mb xs:h-chat_xs sm:h-chat_sm md:h-chat_md lg:h-chat_lg overflow-auto">
        {messages.map(({ id, content, senderId, createdAt }) => {
          const right = senderId === sender?.id;
          return (
            <div className={right ? "self-end" : "self-start"} key={id}>
              <div className="flex my-1">
                {right && (
                  <MessageContent
                    message={content}
                    time={createdAt}
                    sender={true}
                  />
                )}
                <input
                  placeholder={content}
                  type="checkbox"
                  name="vehicle1"
                  value={id}
                  checked={forwardMessages.includes(id)}
                  onChange={handleCheck}
                />
                {!right && (
                  <MessageContent
                    message={content}
                    time={createdAt}
                    sender={false}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ChatList);
