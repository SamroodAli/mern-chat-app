import { UserModel } from "../../prisma";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";
import { Message, User } from "@prisma/client";
import { ChatItem } from "react-chat-elements";

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
          <ChatItem
            avatar={"https://placekitten.com/150"}
            alt={user.username}
            title={user.username}
            subtitle={user.lastMessage?.content}
            date={user.lastMessage?.createdAt}
            // unread={0}
          />
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
