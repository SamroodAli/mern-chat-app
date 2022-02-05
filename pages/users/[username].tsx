import prisma from "../../lib/prisma";
import { Message, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "../../redux/store";

const ENDPOINT = `http://192.168.100.175:3000`;

const Users: NextPage<{ reciever: User; pastMessages: Message[] }> = ({
  reciever,
  pastMessages,
}) => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>(pastMessages);
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
      socket.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket, sender, reciever]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setMessage("");
    if (socket) {
      socket.emit("message", { message });
    }
  };

  return (
    <div>
      <h1>Chat with {reciever.username}</h1>
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

  if (!user) {
    return redirect;
  }

  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      OR: [
        {
          sender: {
            id: currentUser.id,
          },
          reciever: {
            id: user.id,
          },
        },
        {
          sender: {
            id: user.id,
          },
          reciever: {
            id: currentUser.id,
          },
        },
      ],
    },

    select: {
      id: true,
      content: true,
      senderId: true,
    },
  });

  return {
    props: {
      reciever: user,
      pastMessages: messages,
    },
  };
};

export default Users;
