import * as React from "react";
const RecieverMessage = ({ message }: { message: string }) => <p>{message}</p>;
export default React.memo(RecieverMessage);
