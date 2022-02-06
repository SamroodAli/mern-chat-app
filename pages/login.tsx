import * as React from "react";
import { useActions } from "../redux";
import { useRouter } from "next/router";
import { getUser } from "../lib/auth";
import { GetServerSideProps } from "next";

const Login = () => {
  const [email, setEmail] = React.useState("Demo@gmail.com");
  const [password, setPassword] = React.useState("password");
  const { login } = useActions((actions) => actions);
  const router = useRouter();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login({ email, password, router });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            value="Sign in"
            className="bg-teal-500 text-white hover:bg-blue-dark font-bold py-2 px-4 rounded"
          />
        </div>
      </div>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentUser = getUser(context);
  if (currentUser) {
    return {
      redirect: {
        destination: "/users",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Login;
