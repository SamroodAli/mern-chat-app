import * as React from "react";
import Image from "next/image";

const UserCard: React.FC<{
  username: string;
  message: string;
  time: string;
}> = ({ username, message, time }) => {
  return (
    <div className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
      <div className="flex ml-2">
        <Image
          alt={username}
          src="https://placekitten.com/200/300"
          width="40"
          height="40"
          className="rounded-full"
        />
        <div className="flex flex-col ml-2">
          <span className="font-medium text-black">{username}</span>
          <span className="text-sm text-gray-700 truncate w-32">{message}</span>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-sm">{time}</span>
        <i className="fa fa-star text-green-400"></i>
      </div>
    </div>
  );
};

export default React.memo(UserCard);
