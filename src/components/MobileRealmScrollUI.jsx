import { useEffect, useState } from "react";
import staticText from "../content/staticText.json";

/**
 * Brief mobile hint: swipe to scroll. No jump buttons (Room / Career / Desk).
 * Visible only in mobile landscape via CSS.
 */
export default function MobileRealmScrollUI() {
  const copy = staticText.mobile?.realmScroll ?? {};
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const hide = () => setHidden(true);
    const t = window.setTimeout(hide, 7000);
    window.addEventListener("touchstart", hide, { once: true, passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("touchstart", hide);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="mobile-realm-scroll-ui"
      role="status"
      aria-label={copy.toolbarLabel ?? "Scroll the 3D scene"}
    >
      <p className="mobile-realm-scroll-hint">
        {copy.swipeHint ?? "Swipe up or down to scroll"}
      </p>
    </div>
  );
}
