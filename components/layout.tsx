import { User } from "@prisma/client";
import * as React from "react";
import Link from "next/link";

const Layout: React.FunctionComponent<{ user?: User }> = ({
  user,
  children,
}) => {
  return (
    <div>
      <div>Navbar {user ? `${user?.username}` : "Signed out"}</div>
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

export default Layout;
