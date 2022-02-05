import * as React from "react";
import { useActions } from "../redux/store";

const Login = () => {
  const [email, setEmail] = React.useState("Demo@gmail.com");
  const [password, setPassword] = React.useState("password");
  const { login } = useActions((actions) => actions);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <input type="submit" value="Signin" />
    </form>
  );
};

export default Login;
