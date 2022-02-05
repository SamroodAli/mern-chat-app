import { UserModel, UserWithLastMessage } from "../../prisma";
import { GetServerSideProps, NextPage } from "next";
import { getUser, redirect } from "../../lib/auth";
import Link from "next/link";
import { ChatItem } from "react-chat-elements";
import { useRouter } from "next/router";

const Users: NextPage<{ users: UserWithLastMessage[] }> = ({ users }) => {
  const router = useRouter();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link
              href="/users/[username]"
              as={`/users/${user.username}`}
              passHref
            >
              <div>
                <ChatItem
                  onClick={() => {
                    router.push(`/users/${user.username}`);
                  }}
                  avatar={"https://via.placeholder.com/150"}
                  alt={"Reactjs"}
                  title={user.username}
                  subtitle={user.lastMessage?.content}
                  date={new Date()}
                  unread={0}
                />
              </div>
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
  const usersWithLastMessage = await UserModel.getUsersWithLastMessage(user);
  return {
    props: {
      users: usersWithLastMessage,
      user,
    },
  };
};

export default Users;
