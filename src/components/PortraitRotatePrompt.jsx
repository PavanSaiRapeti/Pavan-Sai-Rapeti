import staticText from "../content/staticText.json";

/**
 * Full-screen blocker on mobile portrait: asks user to rotate to landscape.
 * z-index above scene and loading overlay.
 */
export default function PortraitRotatePrompt({ visible }) {
  if (!visible) return null;

  const copy = staticText.mobile ?? {};
  const title = copy.rotateTitle ?? "Rotate your device";
  const body =
    copy.rotateBody ??
    "This experience is built for landscape. Please turn your device sideways.";
  const hint =
    copy.rotateHint ?? "Portrait mode is not supported for the 3D room.";

  return (
    <div
      className="portrait-rotate-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portrait-rotate-title"
      aria-describedby="portrait-rotate-desc"
    >
      <div className="portrait-rotate-card">
        <div className="portrait-rotate-icon" aria-hidden>
          <span className="portrait-rotate-phone" />
          <span className="portrait-rotate-arrow">↻</span>
        </div>
        <h1 id="portrait-rotate-title" className="portrait-rotate-title">
          {title}
        </h1>
        <p id="portrait-rotate-desc" className="portrait-rotate-body">
          {body}
        </p>
        <p className="portrait-rotate-hint">{hint}</p>
      </div>
    </div>
  );
}
