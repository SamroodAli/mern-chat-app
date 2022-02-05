import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import * as React from "react";

const Users: NextPage<{ user: User }> = ({ user }) => {
  const [message, setMessage] = React.useState("");
  return (
    <div>
      <h1>Chat with {user.username}</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
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
