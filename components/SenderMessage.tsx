import * as React from "react";
const SenderMessage = ({ message }: { message: string }) => (
  <p className="inline p-3 bg-green-500 rounded-lg my-5 ">{message}</p>
);
export default React.memo(SenderMessage);
