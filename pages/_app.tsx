import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/layout";
import { StoreProvider } from "easy-peasy";
import { store } from "../redux";
import * as React from "react";
import { NotificationContainer } from "react-notifications";

import "react-notifications/lib/notifications.css";
import "./tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <Layout user={pageProps.currentUser}>
        <NotificationContainer />
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
