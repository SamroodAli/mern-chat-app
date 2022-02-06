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
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <input type="submit" value="Signin" />
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
