import React, { useEffect, useState } from "react";
import staticText from "../../content/staticText.json";

const STORAGE_KEY = "ps-realm-profile-visits";
const SESSION_KEY = "ps-realm-visit-counted";

function readVisits() {
  if (typeof window === "undefined") return 0;
  try {
    const n = parseInt(window.localStorage.getItem(STORAGE_KEY) || "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Plain visits label + count — top center, through poster stick / pass. */
export default function ProfileVisitHud({ visible }) {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let count = readVisits();
    try {
      if (!window.sessionStorage.getItem(SESSION_KEY)) {
        count += 1;
        window.localStorage.setItem(STORAGE_KEY, String(count));
        window.sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      /* ignore */
    }
    setVisits(count);
  }, []);

  if (!visible) return null;

  const label = staticText.realmHud?.visitsLabel ?? "VISITS";

  return (
    <div className="realm-visit-hud" aria-live="polite">
      <span className="realm-visit-hud__label">{label}</span>
      <span className="realm-visit-hud__count">{visits}</span>
    </div>
  );
}
