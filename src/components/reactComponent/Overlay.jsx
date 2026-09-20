import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../redux/actions/reactActions";
import staticText from "../../content/staticText.json";

const STORAGE_KEY = "ps-realm-profile-visits";
const SESSION_KEY = "ps-realm-visit-counted";

function readLocalVisits() {
  if (typeof window === "undefined") return 0;
  try {
    const n = parseInt(window.localStorage.getItem(STORAGE_KEY) || "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeLocalVisits(n) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    /* ignore */
  }
}

/**
 * Top name (only when hero is gone) + visits + game HUD (top-right).
 * Visits prefer Supabase via /api/visits; falls back to localStorage.
 */
const Overlay = ({ heroVisible = false }) => {
  const dispatch = useDispatch();
  const { currentIndex } = useSelector((state) => state.react);
  const menu = staticText.gameMenu ?? {};
  const skillsOpen = currentIndex === 1;
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const bump = async () => {
      const local = readLocalVisits();
      setVisits(local);

      const already = (() => {
        try {
          return Boolean(window.sessionStorage.getItem(SESSION_KEY));
        } catch {
          return true;
        }
      })();

      try {
        if (!already) {
          const res = await fetch("/api/visits", { method: "POST" });
          const data = await res.json().catch(() => ({}));
          if (!cancelled && res.ok && typeof data.count === "number") {
            setVisits(data.count);
            writeLocalVisits(data.count);
            try {
              window.sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
              /* ignore */
            }
            return;
          }
          // API unavailable — local fallback
          const next = local + 1;
          writeLocalVisits(next);
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
          if (!cancelled) setVisits(next);
          return;
        }

        const res = await fetch("/api/visits");
        const data = await res.json().catch(() => ({}));
        if (!cancelled && res.ok && typeof data.count === "number") {
          setVisits(data.count);
          writeLocalVisits(data.count);
        }
      } catch {
        if (!already) {
          const next = local + 1;
          writeLocalVisits(next);
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* ignore */
          }
          if (!cancelled) setVisits(next);
        }
      }
    };

    bump();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSkills = () => {
    dispatch(setCurrentIndex(skillsOpen ? 0 : 1));
  };

  const showName = !heroVisible;

  return (
    <div className="overlay-stack relative flex h-full min-h-0 w-full flex-col items-stretch pointer-events-none">
      <div className="overlay-top-bar">
        <div
          className={`overlay-name-chip pointer-events-auto${
            showName ? " overlay-name-chip--visible" : ""
          }`}
          aria-hidden={!showName}
        >
          <Link
            href="/"
            className="overlay-name-chip__link"
            tabIndex={showName ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            <span className="overlay-name-chip__first">
              {staticText.overlay.firstName}
            </span>
            <span className="overlay-name-chip__last">
              {staticText.overlay.lastName}
            </span>
          </Link>
        </div>

        <div className="overlay-top-right pointer-events-auto">
          <div className="realm-visit-chip" aria-live="polite">
            <span className="realm-visit-chip__label">
              {staticText.realmHud?.visitsLabel ?? "VISITS"}
            </span>
            <span className="realm-visit-chip__count">{visits}</span>
          </div>

          <div
            className="realm-game-hud"
            role="navigation"
            aria-label={menu.label ?? "Menu"}
          >
            <button
              type="button"
              className={`realm-game-hud__btn${
                skillsOpen ? " realm-game-hud__btn--active" : ""
              }`}
              onClick={toggleSkills}
            >
              <span className="realm-game-hud__key">01</span>
              <span>
                {skillsOpen
                  ? menu.closeHint ?? "CLOSE"
                  : staticText.toggleButtons?.[0]?.label ?? "SKILLS"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
