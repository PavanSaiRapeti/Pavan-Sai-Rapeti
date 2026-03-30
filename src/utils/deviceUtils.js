/**
 * Client-only helpers for layout / orientation gates.
 * SSR: always return false-safe values from callers that guard typeof window.
 */

export function isTouchPrimaryDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
}

/** Phones & tablets (incl. iPadOS reporting as Mac). */
export function isMobileUserAgent() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    /\biPad\b/i.test(ua) ||
    iPadOs
  );
}

/**
 * “Mobile” for UX: UA match, or coarse touch on a narrow viewport.
 * Desktop with touch monitor stays desktop unless width is phone-like.
 */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  if (isMobileUserAgent()) return true;
  return isTouchPrimaryDevice() && window.innerWidth <= 900;
}

export function isPortraitOrientation() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: portrait)").matches;
}

export function shouldPromptRotateToLandscape() {
  return isMobileDevice() && isPortraitOrientation();
}
