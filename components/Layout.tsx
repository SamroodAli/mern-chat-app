import { User } from "@prisma/client";
import * as React from "react";
import { useSelector, useActions } from "../redux";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const Layout = ({
  user,
  children,
}: {
  user?: User;
  children: JSX.Element | JSX.Element[];
}) => {
  const { loggedIn, currentUser } = useSelector((state) => state);
  const { setCurrentUser, logout } = useActions((actions) => actions);
  const router = useRouter();

  React.useEffect(() => {
    if (!loggedIn && user) {
      setCurrentUser(user);
    }
  }, []);

  const signOut = () => {
    router.push("/");
    logout();
  };

  const links: { href: string; text: string }[] = [
    { href: "/", text: "Home" },
    { href: "/users", text: "Users" },
  ];

  return (
    <div>
      <Navbar
        links={links}
        lastButtonOnClick={currentUser ? signOut : () => router.push("/login")}
        lastButtonText={currentUser ? "Signout" : "Login"}
        username={currentUser?.username || ""}
      />
      {children}
    </div>
  );
};

export default React.memo<{ user?: User; children: JSX.Element }>(Layout);
