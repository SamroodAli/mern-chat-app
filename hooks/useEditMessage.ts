import * as React from "react";

export const useEditMessages = () => {
  const [forwardMessages, setForwardMessages] = React.useState<number[]>([]);
  const [forward, setForward] = React.useState(false);
  const [forwardUsers, setForwardUsers] = React.useState<String[]>([]);
  const [showUsers, setShowUsers] = React.useState(false);

  React.useEffect(() => {
    if (forwardMessages.length) {
      setForward(true);
    } else {
      setForward(false);
    }
  }, [forwardMessages.length]);

  const addMessage = (id: number) => {
    setForwardMessages((prev) => [...prev, id]);
  };
  const removeMessage = (id: number) => {
    setForwardMessages((prev) => prev.filter((message) => message !== id));
  };

  const addUser = (id: string) => {
    setForwardUsers((prev) => [...prev, id]);
  };
  const removeUser = (id: string) => {
    setForwardUsers((prev) => prev.filter((message) => message !== id));
  };

  const selectUsers = () => setShowUsers(true);

  const completeEdit = () => {
    setForwardMessages([]);
    setForwardUsers([]);
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
