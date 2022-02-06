import * as React from "react";
import { getUser } from "../lib/auth";
import { GetServerSideProps } from "next";
import Form from "../components/form";

const Signup = () => <Form mode="signup" />;

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

export default Signup;
