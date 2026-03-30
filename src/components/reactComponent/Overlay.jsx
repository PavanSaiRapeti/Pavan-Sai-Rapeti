import React from "react";
import { ToggleButton } from "../common/ToggleButton";
import MyCanva from "./layout/MyCanva";
import staticText from "../../content/staticText.json";

const Overlay = ({ setCamera }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex justify-end items-center flex-row w-full h-7">
        <div className="w-full h-13 font-logo text-[1.3rem] leading-[1]">
          <a
            href="/"
            className="text-center overlay pointer-events-auto"
            onClick={() => window.location.reload()}
          >
            {staticText.overlay.firstName} <br />{" "}
            <span className="text-black"> {staticText.overlay.lastName} </span>
          </a>
        </div>
        <div className="flex items-center overlay pointer-events-auto h-full">
          <ToggleButton />
        </div>
      </div>
      <div className="bg-transparent w-[95vw] h-[85vh] pt-10">
        <MyCanva />
      </div>
    </div>
  );
};

export default Overlay;
