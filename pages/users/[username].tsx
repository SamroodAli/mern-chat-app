import { UserModel, MessageModel } from "../../models";
import { Message, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "../../redux";

import MessageList from "../../components/MessageList";
const ENDPOINT = process.env.ENDPOINT!;

const Users: NextPage<{
  reciever: User;
  pastMessages: Message[];
  users: User[];
}> = ({ reciever, pastMessages, users }) => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>(pastMessages);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const { currentUser: sender } = useSelector((state) => state);

  React.useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
  }, []);

  React.useEffect(() => {
    if (socket && sender && reciever) {
      socket.emit("login", sender, reciever);
      socket.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, sender, reciever]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setMessage("");
    if (socket) {
      socket.emit("message", message);
    }
  };

  return (
    <div>
      <h1 className="bg-teal-400 text-center text-lg text-green-900">
        {reciever.username}
      </h1>
      {socket && (
        <MessageList
          messages={messages}
          sender={sender!}
          users={users}
          socket={socket}
        />
      )}
      <div className="flex justify-center">
        <form onSubmit={onSubmit} className="w-11/12 my-3 absolute bottom-0">
          <input
            type="text"
            value={message}
            placeholder="Write Something"
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 pl-12 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600  bg-gray-200 rounded-full"
          />
          <input type="submit" value="Send" className="hidden" />
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = getUser(context);
  if (!currentUser) {
    return redirect;
  }
  const reciever = await UserModel.getCurrentUser(
    context.query.username as string
  );

  const users = await UserModel.getUsersOtherThan(currentUser);

  if (!reciever) {
    return redirect;
  }

  const messages = await MessageModel.getMessages(currentUser.id, reciever.id);

  return {
    props: {
      reciever,
      pastMessages: messages,
      users,
    },
  };
};

export default Users;
