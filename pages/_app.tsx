import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/layout";
import { StoreProvider } from "easy-peasy";
import { store } from "../lib/store";
import * as React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <Layout user={pageProps.currentUser}>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
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
