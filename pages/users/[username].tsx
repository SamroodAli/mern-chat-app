import { UserModel, prisma } from "../../prisma";
import { Message, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "../../redux/store";
import MessageList from "../../components/MessageList";

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
      <MessageList messages={messages} sender={sender!} />
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
  const user = await UserModel.getCurrentUser(context.query.username as string);

  if (!user) {
    return redirect;
  }

  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      content: true,
      createdAt: false,
      updatedAt: false,
      senderId: true,
      sender: {
        select: {
          id: true,
          username: true,
          updatedAt: false,
          createdAt: false,
        },
      },
      reciever: {
        select: {
          id: true,
          username: true,
          updatedAt: false,
          createdAt: false,
        },
      },
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
  });

  return {
    props: {
      reciever: user,
      pastMessages: messages,
    },
  };
};

export default Users;
