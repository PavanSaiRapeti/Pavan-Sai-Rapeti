import React from "react";
import Link from "next/link";
import { ToggleButton } from "../common/ToggleButton";
import staticText from "../../content/staticText.json";

/** Top name + Skills dock only — skills panel lives in Scene (fixed sheet). */
const Overlay = () => {
  return (
    <div className="overlay-stack relative flex flex-col justify-start items-center w-full h-full min-h-0 pointer-events-none">
      <div className="overlay-top-nav flex justify-start items-center flex-row w-full h-7 shrink-0 px-1">
        <div className="font-logo text-[1.3rem] leading-[1] pointer-events-auto">
          <Link
            href="/"
            className="text-center overlay"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            {staticText.overlay.firstName}{" "}
            <span className="text-black">{staticText.overlay.lastName}</span>
          </Link>
        </div>
      </div>

      <div className="realm-nav-dock overlay pointer-events-auto">
        <ToggleButton />
      </div>
    </div>
  );
};

export default Overlay;
