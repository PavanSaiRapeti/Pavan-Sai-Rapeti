import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { REALM_SCROLL_SET_EVENT } from "../../utils/realmScrollBus";

/**
 * Improves drei's ScrollControls on touch devices: iOS-friendly overflow,
 * programmatic scroll from MobileRealmScroll chips, optional touch pan backup.
 */
export default function ScrollControlsMobileFix() {
  const scrollState = useScroll();
  const { invalidate } = useThree();
  const touchRef = useRef({ y: 0, active: false });

  useEffect(() => {
    const el = scrollState?.el;
    if (!el) return;

    el.style.touchAction = "pan-y";
    el.style.overscrollBehavior = "contain";
    if ("webkitOverflowScrolling" in el.style) {
      el.style.webkitOverflowScrolling = "touch";
    }

    const applyTarget = (t) => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 1) return;
      const clamped = Math.min(1, Math.max(0, t));
      el.scrollTop = clamped * max;
      if (scrollState.scroll) scrollState.scroll.current = clamped;
      invalidate();
    };

    const onBus = (e) => {
      applyTarget(e.detail?.t ?? 0);
    };

    window.addEventListener(REALM_SCROLL_SET_EVENT, onBus);

    const mobileLandscape = () =>
      document.body?.dataset?.mobileLandscape === "1";

    const onTouchStart = (ev) => {
      if (!mobileLandscape() || ev.touches.length !== 1) return;
      touchRef.current = { y: ev.touches[0].clientY, active: true };
    };

    const onTouchMove = (ev) => {
      if (!mobileLandscape() || !touchRef.current.active || ev.touches.length !== 1)
        return;
      const y = ev.touches[0].clientY;
      const dy = touchRef.current.y - y;
      touchRef.current.y = y;
      el.scrollTop += dy * 1.15;
      ev.preventDefault();
    };

    const onTouchEnd = () => {
      touchRef.current.active = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener(REALM_SCROLL_SET_EVENT, onBus);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [scrollState, invalidate]);

  return null;
}
