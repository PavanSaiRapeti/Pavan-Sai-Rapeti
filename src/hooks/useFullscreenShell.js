import { useEffect } from "react";

/**
 * Lock layout to the visual viewport. Fullscreen is only via the HUD button.
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
      if (window.scrollY === 0 && h < window.outerHeight) {
        window.scrollTo(0, 1);
      }
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);
    window.visualViewport?.addEventListener("scroll", setAppHeight);

    root.classList.add("app-fullscreen");
    body.classList.add("app-fullscreen");

    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
      window.visualViewport?.removeEventListener("scroll", setAppHeight);
      root.classList.remove("app-fullscreen");
      body.classList.remove("app-fullscreen");
    };
  }, []);
}

export function getFullscreenElement() {
  if (typeof document === "undefined") return null;
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null
  );
}

export function toggleDocumentFullscreen() {
  if (typeof document === "undefined") return Promise.resolve(false);
  const active = getFullscreenElement();
  if (active) {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    if (typeof exit === "function") {
      return Promise.resolve(exit.call(document))
        .then(() => false)
        .catch(() => false);
    }
    return Promise.resolve(false);
  }
  const target = document.documentElement;
  const req =
    target.requestFullscreen ||
    target.webkitRequestFullscreen ||
    target.msRequestFullscreen;
  if (typeof req !== "function") return Promise.resolve(false);
  return Promise.resolve(req.call(target))
    .then(() => true)
    .catch(() => false);
}
