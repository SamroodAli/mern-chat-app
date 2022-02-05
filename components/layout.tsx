import { User } from "@prisma/client";
import * as React from "react";
import Link from "next/link";
import { useSelector, useActions } from "../redux/store";

const Layout: React.FunctionComponent<{ user?: User }> = ({
  user,
  children,
}) => {
  const { loggedIn, currentUser } = useSelector((state) => state);
  const { setCurrentUser, logout } = useActions((actions) => actions);

  React.useEffect(() => {
    console.log("I ran");
    if (!loggedIn && user) {
      setCurrentUser(user);
    }
  }, []);

  const signOut = () => {
    logout();
  };

  return (
    <div>
      <div>
        Navbar {currentUser ? `${currentUser?.username}` : "Signed out"}
      </div>
      <div>
        <Link href="/">
          <a>Home</a>
        </Link>{" "}
        <Link href="/login">
          <a>Login</a>
        </Link>
        <button type="button" onClick={signOut}>
          Signout
        </button>
      </div>
      {children}
    </div>
  );
};

export default React.memo<{ user?: User; children: JSX.Element }>(Layout);
