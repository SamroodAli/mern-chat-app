import * as React from "react";
import { useList } from "./useList";

export const useEditMessages = () => {
  const [forwardMessages, addMessage, removeMessage, clearMessages] =
    useList<number>();
  const [forwardUsers, addUser, removeUser, clearUsers] = useList<string>();

  const [forward, setForward] = React.useState(false);
  const [showUsers, setShowUsers] = React.useState(false);

  React.useEffect(() => {
    if (forwardMessages.length) {
      setForward(true);
    } else {
      setForward(false);
    }
  }, [forwardMessages.length]);

  const selectUsers = () => {
    setShowUsers(true);
    setForward(false);
  };

  const completeEdit = () => {
    clearMessages();
    clearMessages();
    clearUsers();
    setShowUsers(false);
    setForward(false);
  };

  return {
    forwardMessages,
    forwardUsers,
    showUsers,
    forward,
    selectUsers,
    addMessage,
    removeMessage,
    addUser,
    removeUser,
    completeEdit,
  };
};
