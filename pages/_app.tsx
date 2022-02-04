import type { AppContext, AppProps } from "next/app";
import Cookies from "cookies";
import { validateToken } from "../lib/auth";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = ({ ctx: { req, res } }: AppContext) => {
  const token = new Cookies(req!, res!).get("token");
  const user = validateToken(token);
  return {
    pageProps: {
      user,
    },
  };
};

export default MyApp;
