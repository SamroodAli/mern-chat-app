import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "../../redux/store";

const ENDPOINT = `http://192.168.100.175:3000`;

interface MessageData {
  message: string;
}

const Users: NextPage<{ reciever: User }> = ({ reciever }) => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const { currentUser: sender } = useSelector((state) => state);

  React.useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  React.useEffect(() => {
    if (socket && sender && reciever) {
      socket.emit("login", sender, reciever);
      socket.on("message", ({ message }: MessageData) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket, sender, reciever]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message });
    }
  };

  return (
    <div>
      <h1>Chat with {reciever.username}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = getUser(context);
  if (!currentUser) {
    return redirect;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: context.query.username as string,
    },
    select: {
      id: true,
      username: true,
    },
  });

  return {
    props: {
      reciever: user,
    },
  };
};

export default Users;
