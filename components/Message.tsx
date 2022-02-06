import * as React from "react";
import * as timeago from "timeago.js";

const SenderMessage = ({
  message,
  time,
  sender,
}: {
  message: string;
  time: Date;
  sender: boolean;
}) => (
  <div className="mx-3">
    <p
      className={
        sender
          ? "bg-green-400  rounded-lg text-sm p-2"
          : "bg-red-400  rounded-lg text-sm p-2"
      }
    >
      {message}
    </p>
    <p className="text-xs text-right text-gray-500">
      {timeago.format(new Date(time))}
    </p>
  </div>
);
export default React.memo(SenderMessage);
