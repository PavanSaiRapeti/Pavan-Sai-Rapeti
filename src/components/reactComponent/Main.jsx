import React from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StatusDisplay from "./StatusDisplay";

const BubbleContainer = dynamic(() => import("./BubbleContainer"), { ssr: false });

const Main = () => {
  const { currentIndex } = useSelector((state) => state.react);
  return (
    <div className="flex flex-col justify-center items-center w-full h-full relative">
      <div className={currentIndex === 1 ? "" : "hidden"}>
        <BubbleContainer />
      </div>
      <div className={currentIndex === 2 ? "" : "hidden"}>
        <StatusDisplay />
      </div>
    </div>
  );
};

export default Main;
