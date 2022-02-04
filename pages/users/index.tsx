import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";

const Users: NextPage<{ users: User[] }> = ({ users }) => {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link
              href={{
                pathname: "/users/[username]",
                query: { username: user.username },
              }}
            >
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUser(context);

  if (!user) {
    return redirect;
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
