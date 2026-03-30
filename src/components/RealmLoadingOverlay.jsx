import { useEffect, useState } from "react";
import staticText from "../content/staticText.json";
import { clampPercent0to100 } from "../utils/percent";

const MS_PER_CHAR = 42;

/**
 * Full-screen loader: optional anime GIF (public path) + “child” font typing line.
 */
export default function RealmLoadingOverlay({ visible, percent = 0 }) {
  const [mounted, setMounted] = useState(true);
  const [typed, setTyped] = useState("");
  const line = staticText.loading?.realmLine ?? "Loading into Pavan Sai's Realm";
  const gifSrc = staticText.loading?.animeGifSrc ?? "/images/myanime.gif";
  const pct = clampPercent0to100(percent);
  const [gifBroken, setGifBroken] = useState(false);

  useEffect(() => {
    if (!visible) {
      const t = window.setTimeout(() => setMounted(false), 600);
      return () => window.clearTimeout(t);
    }
    setMounted(true);
  }, [visible]);

  useEffect(() => {
    if (!visible || !mounted) return;
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(line.slice(0, i));
      if (i >= line.length) window.clearInterval(id);
    }, MS_PER_CHAR);
    return () => window.clearInterval(id);
  }, [visible, mounted, line]);

  if (!mounted) return null;

  return (
    <div
      className={`realm-loading-overlay ${visible ? "realm-loading-overlay--visible" : ""}`}
      aria-busy={visible}
      aria-live="polite"
    >
      <div className="realm-loading-overlay__inner">
        {!gifBroken ? (
          <img
            src={gifSrc}
            alt=""
            className="realm-loading-overlay__gif"
            width={220}
            height={220}
            onError={() => setGifBroken(true)}
          />
        ) : (
          <div className="realm-loading-overlay__gif-fallback" aria-hidden />
        )}
        <div
          className="realm-loading-overlay__percent"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${pct} percent`}
        >
          <span className="realm-loading-overlay__percent-value">{pct}</span>
          <span className="realm-loading-overlay__percent-sign" aria-hidden>
            %
          </span>
        </div>
        <div className="realm-loading-overlay__bar-track" aria-hidden>
          <div className="realm-loading-overlay__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="realm-loading-overlay__line" style={{ fontFamily: "special" }}>
          {typed}
          {visible ? <span className="realm-loading-overlay__caret">|</span> : null}
        </p>
      </div>
    </div>
  );
}
