import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/Layout";
import { StoreProvider } from "easy-peasy";
import { store } from "../redux";
import * as React from "react";

//@ts-ignore // react notifications module does not have type definitions
import { NotificationContainer } from "react-notifications";

import "react-notifications/lib/notifications.css";
import "./tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={store}>
      <Layout user={pageProps.currentUser}>
        <div>
          <NotificationContainer />
          <Component {...pageProps} />
        </div>
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
