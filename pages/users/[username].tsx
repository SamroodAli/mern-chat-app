import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";
import io, { Socket } from "socket.io-client";

const ENDPOINT = `http://localhost:3000`;

const Users: NextPage<{ user: User }> = ({ user }) => {
  const [message, setMessage] = React.useState("");
  const [response, setResponse] = React.useState<string[]>([]);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  React.useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    newSocket.on("message", (data: string) => {
      console.log(response);
      setResponse((prev) => [...prev, data]);
    });
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (socket) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat with {user.username}</h1>
      <ul>
        {response.map((message) => (
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
      user,
    },
  };
};

export default Users;
