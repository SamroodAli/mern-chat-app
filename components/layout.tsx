import { User } from "@prisma/client";
import * as React from "react";

const Layout: React.FunctionComponent<{ user?: User }> = ({
  user,
  children,
}) => {
  return (
    <div>
      <div>Navbar Hello {user?.username}</div>
      {children}
    </div>
  );
};

export default Layout;
