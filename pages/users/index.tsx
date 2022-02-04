import prisma from "../../lib/prisma";
import { User } from "@prisma/client";
import { NextPage } from "next";

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

export const getServerSideProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
    },
  });
  console.log(users);
  return {
    props: {
      users: users,
    },
  };
};

export default Users;
