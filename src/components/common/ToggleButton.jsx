import React, { useEffect } from "react";
import { ActiveIndicator } from "./ActiveIndicator";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../redux/actions/reactActions";
import staticText from "../../content/staticText.json";

/** Corner dock — Skills only. */
export const ToggleButton = () => {
  const dispatch = useDispatch();
  const { currentIndex } = useSelector((state) => state.react);
  const { isScroll } = useSelector((state) => state.camera);
  const buttons = staticText.toggleButtons;

  useEffect(() => {
    if (isScroll && currentIndex === 1) {
      dispatch(setCurrentIndex(0));
    }
  }, [isScroll, currentIndex, dispatch]);

  const onPick = (value) => {
    if (currentIndex === value) {
      dispatch(setCurrentIndex(0));
      return;
    }
    dispatch(setCurrentIndex(value));
  };

  return (
    <div className="realm-nav-dock__inner" role="navigation" aria-label="Sections">
      {buttons.map((button) => (
        <button
          key={button.value}
          type="button"
          className={`realm-nav-dock__btn${
            currentIndex === button.value ? " realm-nav-dock__btn--active" : ""
          }`}
          onClick={() => onPick(button.value)}
        >
          <span>{button.label}</span>
          {currentIndex === button.value ? <ActiveIndicator /> : null}
        </button>
      ))}
    </div>
  );
};
