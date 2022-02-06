import * as React from "react";
import { Message, User } from "@prisma/client";
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import { useEditMessages } from "../hooks";
import { MessageList, MessageBox } from "react-chat-elements";

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
      socket.emit(
        "forward",
        {
          forwardMessages,
          forwardUsers,
        },
        (response: any) => {
          if (response.status) {
            router.push("/users");
          }
        }
      );
    }
    completeEdit();
  };

  const handleForward = (event: any) => {
    console.log(event);
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

      <ul style={{ backgroundColor: "lightblue" }}>
        <MessageList
          className="message-list"
          lockable={true}
          toBottomHeight={"100%"}
          onForwardClick={handleForward}
          dataSource={messages.map(({ content, senderId, createdAt }) => ({
            position: senderId === sender?.id ? "right" : "left",
            text: content,
            type: "text",
            date: new Date(createdAt),
          }))}
        />

        {messages.map(({ id, content, senderId }) => (
          <li key={id}>
            <label>
              <input
                placeholder="content"
                type="checkbox"
                name="vehicle1"
                value={id}
                onChange={handleCheck}
              >
                <MessageBox
                  position={"left"}
                  type={"text"}
                  text={content}
                  forwarded={true}
                  replyButton={true}
                  onClick={console.log}
                  retracted={true}
                />
              </input>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(ChatList);
