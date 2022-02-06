import { UserModel } from "../../models";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";
import { Message, User } from "@prisma/client";

const Users: NextPage<{ users: (User & { lastMessage?: Message })[] }> = ({
  users,
}) => {
  return (
    <div>
      <h1>Users</h1>
      {users.map((user) => (
        <Link
          key={user.id}
          href="/users/[username]"
          as={`/users/${user.username}`}
          passHref
        >
          {user.username}
        </Link>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getUser(context);

  if (!user) {
    return redirect;
  }
  const usersWithLastMessage = await UserModel.getUsersOtherThan(user);
  return {
    props: {
      users: usersWithLastMessage,
      user,
    },
  };
};

export default Users;
