import React, { useEffect } from "react";
import { ActiveIndicator } from "./ActiveIndicator";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../redux/actions/reactActions";
import staticText from "../../content/staticText.json";

export const ToggleButton = () => {
  const dispatch = useDispatch();
  const {currentIndex} = useSelector((state) => state.react);
  const {isScroll} = useSelector((state) => state.camera);

  const buttons = staticText.toggleButtons;

  useEffect(() => {
    if(isScroll){
      dispatch(setCurrentIndex(5));
    }else{
      dispatch(setCurrentIndex(2));
    }
  }, [isScroll]);

  return (
    <div className="flex rounded-full p-1">
      {buttons.map((button) => (
        <button
          key={button.value}
          className={`flex-1 py-2 px-4 rounded-full transition-colors font-fontbutton text-[1.3rem]`}
          onClick={() => dispatch(setCurrentIndex(button.value))}
        >
          <div className="flex flex-col ">
            {button.label}
            <br />
            {currentIndex === button.value ? <ActiveIndicator /> : null}
          </div>
        </button>
      ))}
    </div>
  );
};
