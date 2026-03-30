import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei/web/ScrollControls";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import CameraRig from "../common/CameraRig";
import DummyCamera from "../common/DummyCamera";
import Room from "../common/Room";
import PaperAnm from "../common/PaperAnm";
import { useCallback, useEffect, useRef, useState } from "react";
import ScrollBlink from "../common/ScrollBlink";
import { useSelector } from "react-redux";
import Overlay from "../reactComponent/Overlay";
import staticText from "../../content/staticText.json";
import flyCursorUrl from "../../assests/fly animation.png";
import { stripMosaicBackground } from "../../utils/spriteMosaicStrip";
import AssetLoadBridge from "./AssetLoadBridge";

const flyCursorSrc = flyCursorUrl?.src || flyCursorUrl;

/** Checker strip for cursor PNG (light + dark grey tiles). */
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

/** Hotspot from top-left of the scaled cursor (px) — tune with art. */
const FLY_CURSOR_HOTSPOT = { x: 14, y: 12 };
const FLY_CURSOR_HEIGHT_PX = 120;

export default function Scene({ onAssetsLoaded }) {
  const [camera, setCamera] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [dinoMode, setDinoMode] = useState("run");
  const [cursorInRoom, setCursorInRoom] = useState(false);
  const cursorInRoomRef = useRef(false);
  const flyCursorImgRef = useRef(null);
  const [hoverNarration, setHoverNarration] = useState(null);
  const [flyCursorDisplaySrc, setFlyCursorDisplaySrc] = useState(flyCursorSrc);
  const isScroll = useSelector(state => state.camera.isScroll);
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

  const moveFlyCursor = useCallback(
    (clientX, clientY) => {
      const el = flyCursorImgRef.current;
      if (!el) return;
      el.style.transform = `translate(${clientX - FLY_CURSOR_HOTSPOT.x}px, ${clientY - FLY_CURSOR_HOTSPOT.y}px)`;
    },
    []
  );

  const useFlyCursor = cursorInRoom && !showResume;

  const setRoomCursor = (active) => {
    cursorInRoomRef.current = active;
    setCursorInRoom(active);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden threejs-container">
    <AssetLoadBridge
      onTexturesReady={() => {
        realmFlagsRef.current.textures = true;
        pingAssetsLoaded();
      }}
    />
    <div className="absolute inset-10 pointer-events-none z-10">
      <Overlay setCamera={setCamera} />
    </div>
    <div
      className="absolute inset-0 z-0 h-full w-full"
      onMouseEnter={(e) => {
        if (showResume) return;
        setRoomCursor(true);
        moveFlyCursor(e.clientX, e.clientY);
      }}
      onMouseLeave={() => {
        setRoomCursor(false);
      }}
      onMouseMove={(e) => {
        if (!cursorInRoomRef.current || showResume) return;
        moveFlyCursor(e.clientX, e.clientY);
      }}
      style={{
        cursor: useFlyCursor ? "none" : "auto",
      }}
    >
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{background:'#FBF8EF', overflow: 'hidden'}}
      className="threejs-container h-full w-full"
    >
      <ScrollControls pages={2}  style={{left:'15px'}}>
        <Room
          onResumeClick={() => {
            setHoverNarration(null);
            setShowResume(true);
          }}
          onDinoModeChange={setDinoMode}
          onHoverNarration={setHoverNarration}
        />
        <DummyCamera isDefaultCamera={camera} />
        <CameraRig isDefaultCamera={!camera} />
        <PaperAnm />
        <directionalLight position={[5, 10, 5]} intensity={1}  />
        <OrbitControls enableZoom={false} enablePan={false} enableDamping={false} />
      </ScrollControls>
      
    </Canvas>
    </div>
    {hoverNarration && !showResume ? (
      <div
        className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center px-6"
        aria-live="polite"
      >
        <div
          className="max-w-lg border-4 border-[#3d3d45] bg-[#fffef6] px-10 py-8 shadow-[6px_6px_0_#1e1e24] text-center"
          style={{ fontFamily: "special" }}
        >
          <p className="text-lg leading-relaxed text-[#222] md:text-xl">
            {hoverNarration}
          </p>
        </div>
      </div>
    ) : null}
    {useFlyCursor ? (
      <img
        ref={flyCursorImgRef}
        src={flyCursorDisplaySrc}
        alt=""
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] select-none"
        style={{
          height: FLY_CURSOR_HEIGHT_PX,
          width: "auto",
          imageRendering: "pixelated",
        }}
      />
    ) : null}
    {!isScroll ? <ScrollBlink /> : ''}
    {dinoMode === "roar" ? (
      <div
        className="pointer-events-none absolute bottom-28 left-1/2 z-[25] -translate-x-1/2 text-center text-black"
        style={{ fontFamily: "special", fontSize: 15 }}
      >
        {staticText.dino?.roarCaption ?? "roarrrrrr..."}
      </div>
    ) : null}
    {showResume ? (
      <div className="absolute inset-0 z-30 bg-black/70 p-4 md:p-8">
        <div className="h-full w-full rounded-lg bg-white shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-black text-lg font-semibold">{staticText.room.resumeModalTitle}</h2>
            <button
              type="button"
              className="rounded bg-black px-3 py-1 text-white"
              onClick={() => setShowResume(false)}
            >
              {staticText.room.resumeCloseButton}
            </button>
          </div>
          <iframe
            title={staticText.room.resumeModalTitle}
            src={resumeUrl}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    ) : null}
  </div>
  );
}