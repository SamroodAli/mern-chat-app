import * as React from "react";

export function useList<T>(): [
  T[],
  (item: T) => T,
  (item: T) => T,
  () => void
] {
  const [list, setList] = React.useState<T[]>([]);

  const addItem = (id: T) => {
    setList((prev) => [...prev, id]);
    return id;
  };

  const removeItem = (id: T) => {
    setList((prev) => prev.filter((message) => message !== id));
    return id;
  };

  const clearList = () => setList([]);

  return [list, addItem, removeItem, clearList];
}
