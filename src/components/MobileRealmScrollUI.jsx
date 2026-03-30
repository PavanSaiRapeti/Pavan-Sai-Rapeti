import { setRealmScrollTarget } from "../utils/realmScrollBus";
import staticText from "../content/staticText.json";

/**
 * Fixed controls for mobile landscape when native scroll is unreliable.
 * Visibility via CSS + body[data-mobile-landscape].
 */
export default function MobileRealmScrollUI() {
  const copy = staticText.mobile?.realmScroll ?? {};
  const topLabel = copy.top ?? "Room";
  const bottomLabel = copy.bottom ?? "Desk";

  return (
    <div
      className="mobile-realm-scroll-ui"
      aria-hidden={false}
      role="toolbar"
      aria-label={copy.toolbarLabel ?? "Scroll the 3D scene"}
    >
      <button
        type="button"
        className="mobile-realm-scroll-btn"
        onClick={() => setRealmScrollTarget(0)}
      >
        ↑ {topLabel}
      </button>
      <button
        type="button"
        className="mobile-realm-scroll-btn"
        onClick={() => setRealmScrollTarget(0.5)}
      >
        {copy.mid ?? "·"}
      </button>
      <button
        type="button"
        className="mobile-realm-scroll-btn"
        onClick={() => setRealmScrollTarget(1)}
      >
        ↓ {bottomLabel}
      </button>
    </div>
  );
}
