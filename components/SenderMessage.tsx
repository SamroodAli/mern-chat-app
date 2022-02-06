import * as React from "react";
const SenderMessage = ({ message }: { message: string }) => (
  <p className="">{message}</p>
);
export default React.memo(SenderMessage);
