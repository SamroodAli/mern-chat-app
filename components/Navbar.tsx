import * as React from "react";
import Link from "next/link";
import NavbarButton from "./NavbarButton";

const NavBar: React.FC<{
  links: { href: string; text: string }[];
  lastButtonOnClick: React.MouseEventHandler<HTMLButtonElement>;
  lastButtonText: string;
  username: string;
}> = ({ links, lastButtonOnClick, lastButtonText, username }) => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-1 lg:p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">MernChat</span>
      </div>
      <div className="w-full  flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {links.map(({ href, text }) => (
            <Link key={text} href={href}>
              <a
                href="#responsive-header"
                className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
              >
                {text}
              </a>
            </Link>
          ))}
        </div>
        <p className="block mt-4 md:text-xl lg:inline-block lg:mt-0 text-teal-900 hover:text-white mr-10">
          {username}
        </p>
        <NavbarButton onClick={lastButtonOnClick} text={lastButtonText} />
      </div>
    </nav>
  );
};

export default React.memo(NavBar);
