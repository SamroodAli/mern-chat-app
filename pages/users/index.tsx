import { UserModel } from "../../prisma";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";
import { ChatItem } from "react-chat-elements";
import { useRouter } from "next/router";
import { Message, User } from "@prisma/client";

const Users: NextPage<{ users: (User & { lastMessage?: Message })[] }> = ({
  users,
}) => {
  const router = useRouter();

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
          <div>
            <ChatItem
              onClick={() => {
                router.push(`/users/${user.username}`);
              }}
              avatar={"https://placekitten.com/g/100/100"}
              alt={"Reactjs"}
              title={user.username}
              subtitle={user.lastMessage?.content}
              date={new Date()}
              unread={0}
            />
          </div>
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
