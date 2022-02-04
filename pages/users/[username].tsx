import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser } from "../../lib/auth";

const Users: NextPage<{ user: User }> = ({ user }) => {
  return (
    <div>
      <h1>Chat with {user.username}</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = getUser(context);

  if (!currentUser) {
    return {
      redirect: "/login",
      props: {},
    };
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
