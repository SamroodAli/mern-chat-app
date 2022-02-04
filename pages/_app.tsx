import type { AppContext, AppProps } from "next/app";
import Cookies from "cookies";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = ({ ctx: { req, res } }: AppContext) => {
  const token = new Cookies(req!, res!).get("token");

  return {
    pageProps: {},
  };
};

export default MyApp;
