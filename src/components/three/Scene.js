import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei/web/ScrollControls";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import CameraRig from "../common/CameraRig";
import DummyCamera from "../common/DummyCamera";
import Room from "../common/Room";
import PaperAnm from "../common/PaperAnm";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollBlink from "../common/ScrollBlink";
import ProfileVisitHud from "../common/ProfileVisitHud";
import RealmHeroCopy from "../common/RealmHeroCopy";
import { useSelector } from "react-redux";
import Overlay from "../reactComponent/Overlay";
import MyCanva from "../reactComponent/layout/MyCanva";
import staticText from "../../content/staticText.json";
import flyCursorUrl from "../../assests/fly animation.png";
import kickCursorUrl from "../../assests/kick.jpg";
import { stripMosaicBackground } from "../../utils/spriteMosaicStrip";
import AssetLoadBridge from "./AssetLoadBridge";
import ScrollControlsMobileFix from "./ScrollControlsMobileFix";
import MobileRealmScrollUI from "../MobileRealmScrollUI";
import { RealmCursorContext } from "../../context/RealmCursorContext";
import ResumeModal from "../reactComponent/ResumeModal";
import { SCROLL_CHAPTERS } from "../../utils/scrollChapters";

const flyCursorSrc = flyCursorUrl?.src || flyCursorUrl;
const kickCursorSrc = kickCursorUrl?.src || kickCursorUrl;

const KICK_FRAME_COUNT = 2;

/** Checker strip for fly cursor PNG (light + dark grey tiles). */
const FLY_CURSOR_STRIP = {
  apply: true,
  maxSaturation: 0.12,
  minLuminance: 0.52,
  keyDarkChecker: true,
  darkCheckerLuminanceMin: 0.26,
  darkCheckerLuminanceMax: 0.52,
  maxRgbSpreadForGrey: 0.055,
  maxSaturationDark: 0.1,
};

/** Flat near-white background on kick sprite (JPEG). */
const KICK_CURSOR_STRIP = {
  apply: true,
  maxSaturation: 0.24,
  minLuminance: 0.76,
  keyDarkChecker: false,
};

const FLY_CURSOR_HOTSPOT = { x: 8, y: 7 };
const FLY_CURSOR_HEIGHT_PX = 72;
const KICK_CURSOR_HEIGHT_PX = 60;

/** Sync DOM overlays to scroll chapters (hero + visits). */
function ScrollOverlayGate({ onHero, onVisits }) {
  const scroll = useScroll();
  const lastHero = useRef(null);
  const lastVisits = useRef(null);
  useFrame(() => {
    const t = scroll.offset ?? 0;
    // Drop hero on the first bit of scroll (not after a long 2% of 12 pages)
    const hero = t < 0.004;
    const visits = t < SCROLL_CHAPTERS.posterFlyOffEnd;
    if (lastHero.current !== hero) {
      lastHero.current = hero;
      onHero(hero);
    }
    if (lastVisits.current !== visits) {
      lastVisits.current = visits;
      onVisits(visits);
    }
  });
  return null;
}

export default function Scene({ onAssetsLoaded }) {
  const [showResume, setShowResume] = useState(false);
  const [activeExperience, setActiveExperience] = useState(null);
  const [dinoMode, setDinoMode] = useState("run");
  const [cursorInRoom, setCursorInRoom] = useState(false);
  const cursorInRoomRef = useRef(false);
  const flyCursorWrapRef = useRef(null);
  const [hoverNarration, setHoverNarration] = useState(null);
  const [flyCursorDisplaySrc, setFlyCursorDisplaySrc] = useState(flyCursorSrc);
  const [kickPlaying, setKickPlaying] = useState(false);
  const [kickFrame, setKickFrame] = useState(0);
  const [kickSpriteRatio, setKickSpriteRatio] = useState(0.5);
  const [kickDisplaySrc, setKickDisplaySrc] = useState(kickCursorSrc);
  const [showVisitHud, setShowVisitHud] = useState(true);
  const [showHeroCopy, setShowHeroCopy] = useState(true);
  const kickLockRef = useRef(false);
  const kickTimersRef = useRef([]);
  const isScroll = useSelector((state) => state.camera.isScroll);
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || staticText.room.resumeUrl;

  const realmFlagsRef = useRef({ textures: false, fonts: false, cursor: false });

  const pingAssetsLoaded = useCallback(() => {
    const f = realmFlagsRef.current;
    if (f.textures && f.fonts && f.cursor) onAssetsLoaded?.();
  }, [onAssetsLoaded]);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      realmFlagsRef.current.fonts = true;
      pingAssetsLoaded();
    });
    return () => {
      cancelled = true;
    };
  }, [pingAssetsLoaded]);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    const finishCursor = () => {
      if (cancelled) return;
      realmFlagsRef.current.cursor = true;
      pingAssetsLoaded();
    };
    img.onload = () => {
      if (cancelled) return;
      try {
        const out = stripMosaicBackground(img, FLY_CURSOR_STRIP);
        setFlyCursorDisplaySrc(out.toDataURL("image/png"));
      } catch {
        setFlyCursorDisplaySrc(flyCursorSrc);
      }
      finishCursor();
    };
    img.onerror = () => {
      if (!cancelled) setFlyCursorDisplaySrc(flyCursorSrc);
      finishCursor();
    };
    img.src = flyCursorSrc;
    return () => {
      cancelled = true;
    };
  }, [flyCursorSrc, pingAssetsLoaded]);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      const fh0 = img.naturalHeight || 1;
      const fw0 = img.naturalWidth / KICK_FRAME_COUNT;
      try {
        const out = stripMosaicBackground(img, KICK_CURSOR_STRIP);
        setKickDisplaySrc(out.toDataURL("image/png"));
        const fh = out.height || fh0;
        const fw = (out.width || img.naturalWidth) / KICK_FRAME_COUNT;
        setKickSpriteRatio(fw / fh);
      } catch {
        setKickDisplaySrc(kickCursorSrc);
        setKickSpriteRatio(fw0 / fh0);
      }
    };
    img.onerror = () => {
      if (!cancelled) setKickSpriteRatio(0.5);
    };
    img.src = kickCursorSrc;
    return () => {
      cancelled = true;
    };
  }, [kickCursorSrc]);

  useEffect(() => {
    return () => {
      kickTimersRef.current.forEach((id) => window.clearTimeout(id));
      kickTimersRef.current = [];
    };
  }, []);

  const moveFlyCursor = useCallback((clientX, clientY) => {
    const el = flyCursorWrapRef.current;
    if (!el) return;
    el.style.transform = `translate(${clientX - FLY_CURSOR_HOTSPOT.x}px, ${
      clientY - FLY_CURSOR_HOTSPOT.y
    }px)`;
  }, []);

  const playKick = useCallback((opts) => {
    if (showResume) return;
    const skipCursorGate = opts?.skipCursorGate === true;
    if (!skipCursorGate && !cursorInRoomRef.current) return;
    if (kickLockRef.current) return;
    kickLockRef.current = true;
    kickTimersRef.current.forEach((id) => window.clearTimeout(id));
    kickTimersRef.current = [];
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) {
      setKickPlaying(true);
      setKickFrame(1);
      const tEnd = window.setTimeout(() => {
        setKickPlaying(false);
        setKickFrame(0);
        kickLockRef.current = false;
        kickTimersRef.current = [];
      }, 130);
      kickTimersRef.current.push(tEnd);
      return;
    }
    setKickPlaying(true);
    setKickFrame(0);
    const tFrame1 = window.setTimeout(() => setKickFrame(1), 95);
    const tEnd = window.setTimeout(() => {
      setKickPlaying(false);
      setKickFrame(0);
      kickLockRef.current = false;
      kickTimersRef.current = [];
    }, 340);
    kickTimersRef.current.push(tFrame1, tEnd);
  }, [showResume]);

  /** Skills bubbles sit above the canvas; room surface mouseleave was hiding the fly sprite. Track at window level. */
  useEffect(() => {
    if (showResume || activeExperience) {
      setRoomCursor(false);
      return;
    }
    const onMove = (e) => {
      if (!cursorInRoomRef.current) setRoomCursor(true);
      moveFlyCursor(e.clientX, e.clientY);
    };
    const onBlur = () => setRoomCursor(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onBlur);
    };
  }, [showResume, activeExperience, moveFlyCursor]);

  const useFlyCursor = cursorInRoom && !showResume && !activeExperience;
  const roomCursor = useFlyCursor ? "none" : "default";
  const careerCopy = staticText.career ?? {};

  const setRoomCursor = (active) => {
    cursorInRoomRef.current = active;
    setCursorInRoom(active);
  };

  return (
    <RealmCursorContext.Provider value={{ playKick }}>
    <div className="relative w-screen h-screen overflow-hidden threejs-container">
      <AssetLoadBridge
        onTexturesReady={() => {
          realmFlagsRef.current.textures = true;
          pingAssetsLoaded();
        }}
      />
      <div className="absolute scene-overlay-safe pointer-events-none z-[50]">
        <Overlay />
      </div>
      {skillsOpen ? (
        <div className="skills-sheet" role="dialog" aria-label="Skills">
          <div className="skills-sheet__inner">
            <MyCanva />
          </div>
        </div>
      ) : null}
      <div
        className="scene-room-surface absolute inset-0 z-0 h-full w-full min-h-0"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          if (showResume || activeExperience) return;
          if (!cursorInRoomRef.current) return;
          moveFlyCursor(e.clientX, e.clientY);
          playKick();
        }}
        style={{ cursor: roomCursor }}
      >
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          style={{ background: "#FBF8EF", overflow: "hidden", cursor: roomCursor }}
          className="threejs-container h-full w-full"
        >
          <ScrollControls pages={12} damping={0.62} style={{ left: "var(--scene-scroll-left, 15px)" }}>
            <ScrollControlsMobileFix />
            <ScrollOverlayGate onHero={setShowHeroCopy} onVisits={setShowVisitHud} />
            <Room
              onResumeClick={() => {
                setHoverNarration(null);
                setActiveExperience(null);
                setShowResume(true);
              }}
              onDinoModeChange={setDinoMode}
              onHoverNarration={setHoverNarration}
              onExperienceSelect={setActiveExperience}
              selectedStationId={activeExperience?.id ?? null}
            />
            <DummyCamera isDefaultCamera={false} />
            <CameraRig isDefaultCamera={true} />
            <PaperAnm />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <OrbitControls
              enabled={false}
              enableZoom={false}
              enablePan={false}
              enableDamping={false}
            />
          </ScrollControls>
        </Canvas>
      </div>
      {hoverNarration && !showResume && !activeExperience ? (
        <div
          className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center px-6"
          aria-live="polite"
        >
          <div
            className="scene-narration-inner max-w-lg border-4 border-[#3d3d45] bg-[#fffef6] px-10 py-8 shadow-[6px_6px_0_#1e1e24] text-center"
            style={{ fontFamily: "special" }}
          >
            <p className="text-lg leading-relaxed text-[#222] md:text-xl">
              {hoverNarration}
            </p>
          </div>
        </div>
      ) : null}
      {activeExperience && !showResume ? (
        <div className="career-experience-overlay">
          <div
            className="career-experience-panel"
            style={{ ["--career-accent"]: activeExperience.accent || "#F96E2A" }}
          >
            <div className="career-experience-panel__head">
              <div>
                <p className="career-experience-panel__year">{activeExperience.year}</p>
                <h2 className="career-experience-panel__company">{activeExperience.company}</h2>
                <p className="career-experience-panel__role">{activeExperience.role}</p>
                <p className="career-experience-panel__dates">{activeExperience.dates}</p>
              </div>
              <button
                type="button"
                className="career-experience-panel__close"
                onClick={() => setActiveExperience(null)}
              >
                {careerCopy.panelClose ?? "Close"}
              </button>
            </div>
            <p className="career-experience-panel__summary">{activeExperience.summary}</p>
            <ul className="career-experience-panel__list">
              {(activeExperience.highlights ?? []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="career-experience-panel__stack">
              {(activeExperience.stack ?? []).map((tech) => (
                <span key={tech} className="career-experience-panel__chip">
                  {tech}
                </span>
              ))}
            </div>
            {activeExperience.ctaResume ? (
              <button
                type="button"
                className="career-experience-panel__cta"
                onClick={() => {
                  setActiveExperience(null);
                  setShowResume(true);
                }}
              >
                {careerCopy.openResume ?? "Open full résumé"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {useFlyCursor ? (
        <div
          ref={flyCursorWrapRef}
          className="pointer-events-none fixed left-0 top-0 z-[70] select-none will-change-transform"
          style={{ transform: "translate(-9999px, -9999px)" }}
        >
          {kickPlaying ? (
            <div
              aria-hidden
              style={{
                height: KICK_CURSOR_HEIGHT_PX,
                width: KICK_CURSOR_HEIGHT_PX * kickSpriteRatio,
                backgroundImage: `url(${kickDisplaySrc})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${KICK_FRAME_COUNT * 100}% 100%`,
                backgroundPosition: `${(kickFrame / (KICK_FRAME_COUNT - 1)) * 100}% 0`,
                imageRendering: "pixelated",
              }}
            />
          ) : (
            <img
              src={flyCursorDisplaySrc}
              alt=""
              aria-hidden
              style={{
                height: FLY_CURSOR_HEIGHT_PX,
                width: "auto",
                display: "block",
                imageRendering: "pixelated",
              }}
            />
          )}
        </div>
      ) : null}
      {!isScroll ? <ScrollBlink /> : ""}
      <RealmHeroCopy
        visible={
          showHeroCopy && !showResume && !activeExperience && !skillsOpen
        }
      />
      <ProfileVisitHud
        visible={
          showVisitHud && !showResume && !activeExperience && !skillsOpen
        }
      />
      {dinoMode === "roar" ? (
        <div
          className="pointer-events-none absolute bottom-28 left-1/2 z-[25] -translate-x-1/2 text-center text-black"
          style={{ fontFamily: "special", fontSize: 15 }}
        >
          {staticText.dino?.roarCaption ?? "roarrrrrr..."}
        </div>
      ) : null}
      <MobileRealmScrollUI />
      {showResume ? (
        <ResumeModal
          title={staticText.room.resumeModalTitle}
          closeLabel={staticText.room.resumeCloseButton}
          onClose={() => setShowResume(false)}
        />
      ) : null}
    </div>
    </RealmCursorContext.Provider>
  );
}
