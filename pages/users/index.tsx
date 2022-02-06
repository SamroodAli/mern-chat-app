import { UserModel } from "../../models";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";
import { Message, User } from "@prisma/client";
import UserCard from "../../components/UserCard";
import * as timeago from "timeago.js";

const Users: NextPage<{ users: (User & { lastMessage?: Message })[] }> = ({
  users,
}) => {
  return (
    <div>
      {users.map(({ id, username, lastMessage }) => (
        <Link key={id} href="/users/[username]" as={`/users/${username}`}>
          <a>
            <UserCard
              username={username}
              message={lastMessage?.content || ""}
              time={lastMessage ? timeago.format(lastMessage.createdAt) : ""}
            />
          </a>
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
