import { createStore, action, Action, createTypedHooks } from "easy-peasy";
import { User } from "@prisma/client";

interface State {
  currentUser?: User;
  login: Action<State, User>;
}

// initial state and available actions
export const store = createStore<State>({
  currentUser: undefined,
  login: action((state, payload) => {
    state.currentUser = payload;
  }),
});

const typedHooks = createTypedHooks<State>();
export const { useStoreActions: useActions } = typedHooks;
export const { useStoreState: useSelector } = typedHooks;
