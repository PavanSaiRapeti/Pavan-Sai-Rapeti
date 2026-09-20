import { useEffect } from "react";

/**
 * Lock the app to the visual viewport and collapse mobile browser chrome
 * where the platform allows (Fullscreen API + visualViewport height).
 */
export default function useFullscreenShell() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;
    const body = document.body;

    const setAppHeight = () => {
      const vv = window.visualViewport;
      const h = Math.round(vv?.height || window.innerHeight);
      root.style.setProperty("--app-height", `${h}px`);
      // Nudge Safari to collapse the URL bar when possible
      if (window.scrollY === 0 && h < window.outerHeight) {
        window.scrollTo(0, 1);
      }
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);

    const tryFullscreen = () => {
      const target = document.getElementById("__next") || body;
      if (!target || document.fullscreenElement) return;
      const req =
        target.requestFullscreen ||
        target.webkitRequestFullscreen ||
        target.msRequestFullscreen;
      if (typeof req === "function") {
        Promise.resolve(req.call(target)).catch(() => {
          /* user denied / unsupported — still using dvh shell */
        });
      }
    };

    // Fullscreen requires a gesture; first tap/pointer enters immersive mode on Android
    const onFirstGesture = () => {
      tryFullscreen();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchend", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { passive: true });
    window.addEventListener("touchend", onFirstGesture, { passive: true });

    root.classList.add("app-fullscreen");
    body.classList.add("app-fullscreen");

    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchend", onFirstGesture);
      root.classList.remove("app-fullscreen");
      body.classList.remove("app-fullscreen");
    };
  }, []);
}
