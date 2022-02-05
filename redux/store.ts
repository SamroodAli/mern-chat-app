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

interface State {
  currentUser?: User;
  loggedIn: Computed<State, boolean>;
  setCurrentUser: Action<State, User>;
  login: Thunk<State, { email: string; password: string }>;
}

// initial state and available actions
export const store = createStore<State>({
  currentUser: undefined,
  loggedIn: computed((state) => state.currentUser !== undefined),
  setCurrentUser: action((state, user) => {
    state.currentUser = user;
  }),
  login: thunk(async (actions, { email, password }) => {
    const { data } = await axios.post("/api/users/login", {
      email,
      password,
    });
    if (data?.content) {
      actions.setCurrentUser(data.content);
    }
  }),
});

const typedHooks = createTypedHooks<State>();
export const { useStoreActions: useActions } = typedHooks;
export const { useStoreState: useSelector } = typedHooks;
