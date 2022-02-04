import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser } from "../../lib/auth";

const Users: NextPage<{ users: User[] }> = ({ users }) => {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUser(context);

  if (!user) {
    return {
      redirect: "/login",
      props: {},
    };
  }

  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  return {
    props: {
      users,
      user,
    },
  };
};

export default Users;
