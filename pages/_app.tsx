import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
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
