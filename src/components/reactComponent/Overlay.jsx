import React from "react";
import Link from "next/link";
import { ToggleButton } from "../common/ToggleButton";
import MyCanva from "./layout/MyCanva";
import staticText from "../../content/staticText.json";

const Overlay = () => {
  return (
    <div className="overlay-stack flex flex-col justify-center items-center w-full h-full min-h-0">
      <div className="flex justify-end items-center flex-row w-full h-7">
        <div className="w-full h-13 font-logo text-[1.3rem] leading-[1]">
          <Link
            href="/"
            className="text-center overlay pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            {staticText.overlay.firstName} <br />{" "}
            <span className="text-black"> {staticText.overlay.lastName} </span>
          </Link>
        </div>
        <div className="flex items-center overlay pointer-events-auto h-full">
          <ToggleButton />
        </div>
      </div>
      <div className="overlay-panel-safe overlay-main-panel bg-transparent w-[95vw] h-[85vh] pt-10 flex min-h-0 flex-1 flex-col">
        <MyCanva />
      </div>
    </div>
  );
};

export default Overlay;
