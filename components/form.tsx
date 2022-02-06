import * as React from "react";
import { useActions } from "../redux";
import { useRouter } from "next/router";
import Link from "next/link";

const Form = ({ mode }: { mode: "signup" | "login" }) => {
  const [username, setUsername] = React.useState<string | undefined>(undefined);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { authenticate } = useActions((actions) => actions);
  const router = useRouter();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    authenticate({ router, email, password, username });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        {mode === "signup" && (
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              id="username"
              type="text"
              value={username}
              placeholder="Email"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="username"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <input
            type="submit"
            value={mode === "signup" ? "Sign up" : "Login"}
            className="bg-teal-500 text-white hover:bg-blue-dark font-bold py-2 px-4 rounded"
          />
          {mode === "login" && (
            <div className="flex mx-3 items-center">
              <p className="mx-3 text-teal-700">Dont have an account ?</p>
              <Link href="/signup">
                <a>
                  <p className="bg-teal-500 text-white hover:bg-blue-dark font-bold py-2 px-4 rounded">
                    Sign up
                  </p>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default Form;
