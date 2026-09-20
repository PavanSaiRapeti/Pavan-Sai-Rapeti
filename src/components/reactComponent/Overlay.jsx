import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../redux/actions/reactActions";
import staticText from "../../content/staticText.json";

const COUNT_KEY = "ps-realm-profile-visits";
const VISITOR_KEY = "ps-realm-visitor-id";
const LOCAL_COUNTED_KEY = "ps-realm-visitor-local-counted";

function readLocalVisits() {
  if (typeof window === "undefined") return 0;
  try {
    const n = parseInt(window.localStorage.getItem(COUNT_KEY) || "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeLocalVisits(n) {
  try {
    window.localStorage.setItem(COUNT_KEY, String(n));
  } catch {
    /* ignore */
  }
}

function getOrCreateVisitorId() {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (id && /^[A-Za-z0-9_-]{8,80}$/.test(id)) return id;
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, "")
        : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `v${Date.now().toString(36)}`;
  }
}

function wasLocallyCounted(visitorId) {
  try {
    return window.localStorage.getItem(LOCAL_COUNTED_KEY) === visitorId;
  } catch {
    return false;
  }
}

function markLocallyCounted(visitorId) {
  try {
    window.localStorage.setItem(LOCAL_COUNTED_KEY, visitorId);
  } catch {
    /* ignore */
  }
}

/**
 * Top name + unique visit count (visitor id stored in DB — no duplicate bumps).
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

    const applyCount = (n) => {
      if (cancelled || typeof n !== "number" || !Number.isFinite(n) || n < 0)
        return;
      setVisits(n);
      writeLocalVisits(n);
    };

    const syncVisits = async () => {
      applyCount(readLocalVisits());
      const visitorId = getOrCreateVisitorId();

      try {
        const res = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && typeof data.count === "number") {
          applyCount(data.count);
          markLocallyCounted(visitorId);
          return;
        }

        // Offline / tables missing — local unique bump once per visitor id
        if (!wasLocallyCounted(visitorId)) {
          applyCount(readLocalVisits() + 1);
          markLocallyCounted(visitorId);
        } else {
          const getRes = await fetch("/api/visits");
          const getData = await getRes.json().catch(() => ({}));
          if (getRes.ok && typeof getData.count === "number") {
            applyCount(getData.count);
          }
        }
      } catch {
        if (!wasLocallyCounted(visitorId)) {
          applyCount(readLocalVisits() + 1);
          markLocallyCounted(visitorId);
        }
      }
    };

    syncVisits();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSkills = () => {
    dispatch(setCurrentIndex(skillsOpen ? 0 : 1));
  };

  const showName = !heroVisible;
  const displayCount = Number.isFinite(visits) ? visits : 0;

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
          <div
            className="realm-visit-chip"
            aria-live="polite"
            title="Unique profile visits"
          >
            <span className="realm-visit-chip__label">
              {staticText.realmHud?.visitsLabel ?? "VISIT"}
            </span>
            <span className="realm-visit-chip__count">{displayCount}</span>
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
