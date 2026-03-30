import { useEffect, useState } from "react";
import {
  isMobileDevice,
  isPortraitOrientation,
  shouldPromptRotateToLandscape,
} from "../utils/deviceUtils";

/**
 * Tracks mobile + portrait/landscape for rotate prompt and body data attributes.
 * Does not run meaningful logic on the server.
 */
export function useMobilePortraitGate() {
  const [snapshot, setSnapshot] = useState({
    isMobile: false,
    isPortrait: false,
    showRotatePrompt: false,
  });

  useEffect(() => {
    const update = () => {
      const mobile = isMobileDevice();
      const portrait = isPortraitOrientation();
      const showRotate = shouldPromptRotateToLandscape();
      setSnapshot({
        isMobile: mobile,
        isPortrait: portrait,
        showRotatePrompt: showRotate,
      });

      document.body.dataset.mobile = mobile ? "1" : "0";
      document.body.dataset.orientation = portrait ? "portrait" : "landscape";
      document.body.dataset.mobileLandscape =
        mobile && !portrait ? "1" : "0";
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const mq = window.matchMedia("(orientation: portrait)");
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
    } else {
      mq.addListener(update);
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", update);
      } else {
        mq.removeListener(update);
      }
      delete document.body.dataset.mobile;
      delete document.body.dataset.orientation;
      delete document.body.dataset.mobileLandscape;
    };
  }, []);

  return snapshot;
}
