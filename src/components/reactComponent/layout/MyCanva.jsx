import React from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const Main = dynamic(() => import("../Main"), {
  ssr: false,
});

/** Layout split only on wide desktops; phones/tablets in landscape stay full-width (see globals `.my-canva-*`). */
const MyCanva = () => {
  const { currentIndex } = useSelector((state) => state.react);
  const myself = currentIndex === 2;

  return (
    <div
      className={`my-canva-root flex w-full h-full min-h-0${myself ? " my-canva-root--myself" : ""}`}
    >
      <div className="my-canva-sidebar shrink-0" aria-hidden />
      <div className="my-canva-main-col flex min-h-0 flex-1 flex-col">
        <Main />
      </div>
    </div>
  );
};

export default MyCanva;
