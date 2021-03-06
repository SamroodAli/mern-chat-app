import {
  createStore,
  action,
  Action,
  createTypedHooks,
  thunk,
  Thunk,
  computed,
  Computed,
} from "easy-peasy";
import { User } from "@prisma/client";
import axios from "axios";
import { NextRouter } from "next/router";
//@ts-ignore // react notifications module does not have type definitions
import { NotificationManager } from "react-notifications";

interface State {
  currentUser?: User;
  loggedIn: Computed<State, boolean>;
  setCurrentUser: Action<State, User | undefined>;
  authenticate: Thunk<
    State,
    { router: NextRouter; email: string; password: string; username?: string }
  >;
  logout: Thunk<State>;
}

// initial state and available actions
export const store = createStore<State>({
  currentUser: undefined,
  loggedIn: computed((state) => state.currentUser !== undefined),
  setCurrentUser: action((state, user) => {
    state.currentUser = user;
  }),
  logout: thunk(async (actions) => {
    const { data } = await axios.post("/api/users/logout");
    if (data) {
      actions.setCurrentUser(undefined);
      NotificationManager.success("Signed out successfully");
    }
  }),
  authenticate: thunk(
    async (actions, { router, email, password, username }) => {
      const mode = username ? "signup" : "login";
      const { data } = await axios.post(`/api/users/${mode}`, {
        email,
        password,
        username,
      });
      if (data?.content) {
        actions.setCurrentUser(data.content);
        NotificationManager.success("Login successfull", "Welcome", 200);
        router.push("/users");
      } else {
        NotificationManager.error("Invalid credentials", "login error!", 200);
      }
    }
  ),
});

const typedHooks = createTypedHooks<State>();
export const { useStoreActions: useActions } = typedHooks;
export const { useStoreState: useSelector } = typedHooks;
