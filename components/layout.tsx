import { User } from "@prisma/client";
import * as React from "react";
import Link from "next/link";
import { useSelector, useActions } from "../lib/store";

const Layout: React.FunctionComponent<{ user?: User }> = ({
  user,
  children,
}) => {
  const { currentUser } = useSelector((state) => state);
  const { login } = useActions((actions) => actions);

  React.useEffect(() => {
    if (!currentUser && user) {
      login(user);
    }
  }, []);

  return (
    <div>
      <div>Navbar {user ? `${currentUser?.username}` : "Signed out"}</div>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>{" "}
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default React.memo<{ user?: User; children: JSX.Element }>(Layout);
