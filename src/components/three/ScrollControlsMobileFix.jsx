import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { REALM_SCROLL_SET_EVENT } from "../../utils/realmScrollBus";

/**
 * Touch-friendly ScrollControls: iOS overflow + swipe pan on the scene surface.
 * Also keeps scroll offset stable across resize / fullscreen so the desk doesn’t jump.
 */
export default function ScrollControlsMobileFix() {
  const scrollState = useScroll();
  const { invalidate, gl } = useThree();
  const touchRef = useRef({ y: 0, active: false });
  const offsetRef = useRef(0);

  useEffect(() => {
    const el = scrollState?.el;
    if (!el) return;

    el.style.touchAction = "pan-y";
    el.style.overscrollBehavior = "contain";
    if ("webkitOverflowScrolling" in el.style) {
      el.style.webkitOverflowScrolling = "touch";
    }

    const readOffset = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 1) return offsetRef.current;
      return el.scrollTop / max;
    };

    const applyTarget = (t) => {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 1) return;
      const clamped = Math.min(1, Math.max(0, t));
      offsetRef.current = clamped;
      el.scrollTop = clamped * max;
      if (scrollState.scroll) scrollState.scroll.current = clamped;
      invalidate();
    };

    offsetRef.current = readOffset();

    const onScroll = () => {
      offsetRef.current = readOffset();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const restoreOffset = () => {
      // After layout height changes (fullscreen), re-apply the same fraction.
      requestAnimationFrame(() => applyTarget(offsetRef.current));
    };
    window.addEventListener("resize", restoreOffset);
    window.visualViewport?.addEventListener("resize", restoreOffset);
    document.addEventListener("fullscreenchange", restoreOffset);
    document.addEventListener("webkitfullscreenchange", restoreOffset);

    const onBus = (e) => {
      applyTarget(e.detail?.t ?? 0);
    };
    window.addEventListener(REALM_SCROLL_SET_EVENT, onBus);

    const isMobileScrollMode = () =>
      document.body?.dataset?.mobileLandscape === "1" ||
      document.body?.dataset?.mobile === "1";

    const onTouchStart = (ev) => {
      if (!isMobileScrollMode() || ev.touches.length !== 1) return;
      touchRef.current = { y: ev.touches[0].clientY, active: true };
    };

    const onTouchMove = (ev) => {
      if (!isMobileScrollMode() || !touchRef.current.active || ev.touches.length !== 1)
        return;
      const y = ev.touches[0].clientY;
      const dy = touchRef.current.y - y;
      touchRef.current.y = y;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 1) {
        el.scrollTop += dy * 1.35;
        const next = el.scrollTop / max;
        offsetRef.current = next;
        if (scrollState.scroll) {
          scrollState.scroll.current = next;
        }
        invalidate();
      }
      if (ev.cancelable) ev.preventDefault();
    };

    const onTouchEnd = () => {
      touchRef.current.active = false;
    };

    // Scroll overlay + canvas (touches often hit the WebGL surface)
    const canvas = gl?.domElement;
    const targets = [el, canvas].filter(Boolean);

    targets.forEach((node) => {
      node.addEventListener("touchstart", onTouchStart, { passive: true });
      node.addEventListener("touchmove", onTouchMove, { passive: false });
      node.addEventListener("touchend", onTouchEnd, { passive: true });
      node.addEventListener("touchcancel", onTouchEnd, { passive: true });
    });

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", restoreOffset);
      window.visualViewport?.removeEventListener("resize", restoreOffset);
      document.removeEventListener("fullscreenchange", restoreOffset);
      document.removeEventListener("webkitfullscreenchange", restoreOffset);
      window.removeEventListener(REALM_SCROLL_SET_EVENT, onBus);
      targets.forEach((node) => {
        node.removeEventListener("touchstart", onTouchStart);
        node.removeEventListener("touchmove", onTouchMove);
        node.removeEventListener("touchend", onTouchEnd);
        node.removeEventListener("touchcancel", onTouchEnd);
      });
    };
  }, [scrollState, invalidate, gl]);

  return null;
}
