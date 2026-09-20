import React from "react";
import Main from "../Main";

/** Skills playfield host — eager import so bubbles show immediately. */
const MyCanva = () => {
  return (
    <div className="my-canva-root my-canva-root--skills flex h-full min-h-0 w-full flex-col">
      <div className="my-canva-main-col flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <Main />
      </div>
    </div>
  );
};

export default MyCanva;
