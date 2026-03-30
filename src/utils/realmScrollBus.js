export const REALM_SCROLL_SET_EVENT = "realm-scroll-set";

/**
 * @param {number} t scroll target 0 (room top) … 1 (desk)
 */
export function setRealmScrollTarget(t) {
  if (typeof window === "undefined") return;
  const clamped = Math.min(1, Math.max(0, Number(t) || 0));
  window.dispatchEvent(
    new CustomEvent(REALM_SCROLL_SET_EVENT, { detail: { t: clamped } })
  );
}
