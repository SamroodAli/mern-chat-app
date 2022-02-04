// import { contextsKey } from "express-validator/src/base";
import { getUser } from "../lib/auth";
import type { AppContext, AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = ({ ctx }: AppContext) => {
  // const token = new Cookies(req!, res!).get("token");
  // const user = validateToken(token);
  const user = getUser(ctx);

  return {
    pageProps: {
      user,
    },
  };
};

export default MyApp;
