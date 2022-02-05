import { createStore, action, Action, createTypedHooks } from "easy-peasy";
import { User } from "@prisma/client";

interface StoreModel {
  currentUser?: User;
  login: Action<StoreModel, User>;
}

export const store = createStore<StoreModel>({
  login: action((state, payload) => {
    state.currentUser = payload;
  }),
});

const typedHooks = createTypedHooks<StoreModel>();
export const { useStoreActions: useActions } = typedHooks;
export const { useStoreState: useSelector } = typedHooks;
