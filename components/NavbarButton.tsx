import * as React from "react";

const NavbarButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}> = ({ onClick, text }) => {
  return (
    <div>
      <button
        onClick={onClick}
        type="button"
        className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
      >
        {text}
      </button>
    </div>
  );
};

export default React.memo(NavbarButton);
