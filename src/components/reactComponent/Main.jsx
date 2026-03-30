import React from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StatusDisplay from "./StatusDisplay";

const BubbleContainer = dynamic(() => import("./BubbleContainer"), { ssr: false });

const Main = () => {
  const { currentIndex } = useSelector((state) => state.react);
  return (
    <div className="main-panel-inner flex min-h-0 w-full flex-1 flex-col relative">
      <div
        className={
          currentIndex === 1
            ? "flex min-h-0 w-full max-w-full flex-1 flex-col overflow-hidden"
            : "hidden"
        }
      >
        <BubbleContainer />
      </div>
      <div
        className={
          currentIndex === 2
            ? "myself-main-col flex min-h-0 w-full max-w-full flex-1 flex-col items-center justify-center overflow-y-auto"
            : "hidden"
        }
      >
        <StatusDisplay />
      </div>
    </div>
  );
};

export default Main;
