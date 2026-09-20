import React from "react";
import { useSelector } from "react-redux";
import BubbleContainer from "./BubbleContainer";

const Main = () => {
  const { currentIndex } = useSelector((state) => state.react);
  if (currentIndex !== 1) return null;

  return (
    <div className="skills-fullscreen flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <BubbleContainer />
    </div>
  );
};

export default Main;
