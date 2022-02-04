import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/layout";
import { User } from "@prisma/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout user={pageProps.currentUser}>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = ({ ctx }: AppContext) => {
  const currentUser = getUser(ctx);

  return {
    pageProps: {
      currentUser,
    },
  };
};

export default MyApp;
