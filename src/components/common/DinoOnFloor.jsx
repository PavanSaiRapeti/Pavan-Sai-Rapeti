import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  drawableDimensions,
  stripMosaicBackground,
  subscribeDrawableReady,
} from "../../utils/spriteMosaicStrip";
import dinoRunningUrl from "../../assests/dino running.png";
import dinoDeadUrl from "../../assests/dino dead.png";
import dinoRoarUrl from "../../assests/dino roar.png";
import dinoJumpUrl from "../../assests/dino jump.png";
import trexRoarAudioUrl from "../../assests/audio/trexaudio.mp3";

const trexRoarSrc = trexRoarAudioUrl?.src || trexRoarAudioUrl;

/**
 * Floor dino — edit only this object. Sections are independent (run / dead / roar / jump).
 */
const DINO_ON_FLOOR_CONFIG = {
  atlas: {
    running: {
      frameCount: 5,
      frameEdgeInsetPx: 6,
      minUvCellWidthFraction: 0.7,
    },
    /** 1048×174 sheet, 4 cols → 262px/cell; art 245×174 → inset (262−245)/2 ≈ 8px per side */
    dead: {
      frameCount: 4,
      frameEdgeInsetPx: 5,
      minUvCellWidthFraction: 0.25,
    },
    /** dino roar.png — 5 equal cells in sheet; set to 4 if you only want the first four poses */
    roar: {
      frameCount: 4,
      frameEdgeInsetPx: 6,
      minUvCellWidthFraction: 0.76,
    },
    /** dino jump.png */
    jump: {
      frameCount: 5,
      frameEdgeInsetPx: 6,
      minUvCellWidthFraction: 0.8,
    },
  },
  animation: {
    runFramesPerSecond: 4,
    deadFramesPerSecond: 6,
    roarFramesPerSecond: 3,
    jumpFramesPerSecond: 5,
    walkPhaseSpeed: 0.09 ,
  },
  /** Seconds of walking before auto roar (only while mode is `run`) */
  timers: {
    secondsUntilRoar: 15,
  },
  /** Space triggers jump (when not dead). Change to another key code if needed. */
  input: {
    jumpKey: " ",
  },
  walk: {
    radiusWorldUnits: 6,
  },
  size: {
    planeWidth: 5 * 0.5 * 0.5,
    planeHeight: 1.8 * 0.5 * 0.5 * 2.15,
  },
  placement: {
    positionX: 0,
    positionY: -0.034,
    positionZ: 2.85,
  },
  /** World Y added on phones (`body[data-mobile="1"]`) so the dino sits above the bottom safe area */
  mobile: {
    yLift: 0.44,
    zNudge: -1.00,
  },
  /**
   * Checker key: light grey = `sat` + `lum > minLuminance`. Dark checker tiles need `keyDarkChecker` + RGB spread.
   */
  backgroundRemovalRunning: {
    apply: true,
    maxSaturation: 0.12,
    minLuminance: 0.52,
  },
  backgroundRemovalDead: {
    apply: true,
    maxSaturation: 0.12,
    minLuminance: 0.52,
    keyDarkChecker: true,
    darkCheckerLuminanceMin: 0.26,
    darkCheckerLuminanceMax: 0.52,
    maxRgbSpreadForGrey: 0.055,
    maxSaturationDark: 0.1,
  },
  backgroundRemovalRoar: {
    apply: false,
    maxSaturation: 0.12,
    minLuminance: 0.52,
  },
  backgroundRemovalJump: {
    apply: true,
    maxSaturation: 0.12,
    minLuminance: 0.52,
    keyDarkChecker: true,
    darkCheckerLuminanceMin: 0.26,
    darkCheckerLuminanceMax: 0.52,
    maxRgbSpreadForGrey: 0.055,
    maxSaturationDark: 0.1,
  },
  material: {
    alphaTest: 0.12,
    depthWrite: false,
    toneMapped: false,
  },
};

/** Tracks `body[data-mobile]` set by useMobilePortraitGate (SSR-safe). */
function usePortfolioBodyMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => setMobile(document.body?.dataset?.mobile === "1");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile"],
    });
    window.addEventListener("resize", read);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", read);
    };
  }, []);
  return mobile;
}

const DINO_MOSAIC_STRIPPED = "__dinoMosaicStripped";
const DINO_STRIP_SIG = "__dinoStripSig";
const DINO_TEXTURE_ORIGINAL_IMAGE = "__dinoTextureOriginalImage";

function stripConfigSignature(bg) {
  if (!bg || bg.apply === false) return "off";
  return [
    bg.apply,
    bg.maxSaturation,
    bg.minLuminance,
    bg.keyDarkChecker,
    bg.darkCheckerLuminanceMin,
    bg.darkCheckerLuminanceMax,
    bg.maxRgbSpreadForGrey,
    bg.maxSaturationDark,
  ].join("|");
}

/**
 * Three r150: GPU uses `texture.encoding`, not `colorSpace` on Texture — always set sRGBEncoding when needed.
 */
function configureAtlasSampling(map, opts = {}) {
  const applySRGB = opts.applySRGB !== false;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.flipY = false;
  map.minFilter = THREE.NearestFilter;
  map.magFilter = THREE.NearestFilter;
  map.generateMipmaps = false;
  if (applySRGB && THREE.sRGBEncoding !== undefined) {
    map.encoding = THREE.sRGBEncoding;
  }
  map.needsUpdate = true;
}

function finalizeAtlasTexture(map, bg, atlasStrip) {
  const src = map.image;
  const { w, h } = drawableDimensions(src);
  if (!w || !h) return;

  if (bg.apply === false) {
    configureAtlasSampling(map, { applySRGB: true });
    setAtlasFrame(map, 0, atlasStrip);
    map.needsUpdate = true;
    return;
  }

  const sig = stripConfigSignature(bg);
  if (map.userData[DINO_MOSAIC_STRIPPED] && map.userData[DINO_STRIP_SIG] === sig) {
    configureAtlasSampling(map, { applySRGB: true });
    setAtlasFrame(map, 0, atlasStrip);
    map.needsUpdate = true;
    return;
  }

  if (!(src instanceof HTMLCanvasElement)) {
    map.userData[DINO_TEXTURE_ORIGINAL_IMAGE] = src;
  }
  const imageForStrip = map.userData[DINO_TEXTURE_ORIGINAL_IMAGE] ?? src;
  const processed = stripMosaicBackground(imageForStrip, bg);
  map.image = processed;
  map.userData[DINO_MOSAIC_STRIPPED] = true;
  map.userData[DINO_STRIP_SIG] = sig;
  configureAtlasSampling(map, { applySRGB: true });
  setAtlasFrame(map, 0, atlasStrip);
  map.needsUpdate = true;
}

function setAtlasFrame(map, frameIndex, atlasStrip) {
  const w = drawableDimensions(map.image).w;
  if (!w) return;
  const frameCount = Math.max(1, Math.round(atlasStrip.frameCount));
  const padPx = atlasStrip.frameEdgeInsetPx;
  const padU = padPx / w;
  const cellU = 1 / frameCount;
  const minFrac = atlasStrip.minUvCellWidthFraction;
  map.repeat.set(Math.max(cellU - 2 * padU, cellU * minFrac), 1);
  map.offset.x = frameIndex * cellU + padU;
  map.offset.y = 0;
}

export default function DinoOnFloor({ onModeChange }) {
  const cfg = DINO_ON_FLOOR_CONFIG;
  const isBodyMobile = usePortfolioBodyMobile();
  const prevReportedModeRef = useRef(null);
  const runPath = dinoRunningUrl?.src || dinoRunningUrl;
  const deadPath = dinoDeadUrl?.src || dinoDeadUrl;
  const roarPath = dinoRoarUrl?.src || dinoRoarUrl;
  const jumpPath = dinoJumpUrl?.src || dinoJumpUrl;
  const [runMap, deadMap, roarMap, jumpMap] = useLoader(THREE.TextureLoader, [
    runPath,
    deadPath,
    roarPath,
    jumpPath,
  ]);

  const groupRef = useRef(null);
  /** Base Y/Z (includes mobile lift); X is driven by walk in useFrame */
  const dinoBaseYzRef = useRef({ y: 0, z: 0 });
  const materialRef = useRef(null);
  const timeRef = useRef(0);
  const deadTimeRef = useRef(0);
  const roarTimeRef = useRef(0);
  const jumpTimeRef = useRef(0);
  /** run | roar | jump | dead */
  const modeRef = useRef("run");
  const deadDoneRef = useRef(false);
  /** Accumulates only while walking (`run`) — triggers roar */
  const walkSecondsUntilRoarRef = useRef(0);

  const atlasRun = cfg.atlas.running;
  const atlasDead = cfg.atlas.dead;
  const atlasRoar = cfg.atlas.roar;
  const atlasJump = cfg.atlas.jump;
  const runFrames = Math.round(atlasRun.frameCount);
  const deadFrames = Math.round(atlasDead.frameCount);
  const roarFrames = Math.round(atlasRoar.frameCount);
  const jumpFrames = Math.round(atlasJump.frameCount);

  const roarAudioRef = useRef(null);
  /** Browsers block Audio.play() until a user gesture; primed on first pointer/key */
  const roarAudioUnlockedRef = useRef(false);
  /** max(sprite strip time, trexaudio.mp3 length) — updated on `loadedmetadata` */
  const roarDurationSecRef = useRef(
    roarFrames / cfg.animation.roarFramesPerSecond
  );

  const { placement, size, material, mobile: mobileAdjust } = cfg;
  const yLift = isBodyMobile ? mobileAdjust?.yLift ?? 0 : 0;
  const zNudge = isBodyMobile ? mobileAdjust?.zNudge ?? 0 : 0;
  dinoBaseYzRef.current.y = placement.positionY + yLift;
  dinoBaseYzRef.current.z = placement.positionZ + zNudge;

  useEffect(() => {
    let cancelled = false;
    const map = runMap;
    const run = () => {
      if (!cancelled) finalizeAtlasTexture(map, cfg.backgroundRemovalRunning, atlasRun);
    };
    const unsub = subscribeDrawableReady(map.image, run);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [runMap, cfg.backgroundRemovalRunning, atlasRun]);

  useEffect(() => {
    let cancelled = false;
    const map = deadMap;
    const run = () => {
      if (!cancelled) finalizeAtlasTexture(map, cfg.backgroundRemovalDead, atlasDead);
    };
    const unsub = subscribeDrawableReady(map.image, run);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [deadMap, cfg.backgroundRemovalDead, atlasDead]);

  useEffect(() => {
    let cancelled = false;
    const map = roarMap;
    const run = () => {
      if (!cancelled) finalizeAtlasTexture(map, cfg.backgroundRemovalRoar, atlasRoar);
    };
    const unsub = subscribeDrawableReady(map.image, run);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [roarMap, cfg.backgroundRemovalRoar, atlasRoar]);

  useEffect(() => {
    let cancelled = false;
    const map = jumpMap;
    const run = () => {
      if (!cancelled) finalizeAtlasTexture(map, cfg.backgroundRemovalJump, atlasJump);
    };
    const unsub = subscribeDrawableReady(map.image, run);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [jumpMap, cfg.backgroundRemovalJump, atlasJump]);

  useEffect(() => {
    const a = new Audio(trexRoarSrc);
    a.preload = "auto";
    roarAudioRef.current = a;
    const vis = roarFrames / cfg.animation.roarFramesPerSecond;
    const syncDur = () => {
      const d = a.duration;
      roarDurationSecRef.current =
        d && Number.isFinite(d) && !Number.isNaN(d) ? Math.max(vis, d) : vis;
    };
    a.addEventListener("loadedmetadata", syncDur);
    const onErr = () => {
      roarDurationSecRef.current = vis;
    };
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("loadedmetadata", syncDur);
      a.removeEventListener("error", onErr);
      a.pause();
      roarAudioRef.current = null;
    };
  }, [roarFrames, cfg.animation.roarFramesPerSecond]);

  useEffect(() => {
    const primeAudio = () => {
      if (roarAudioUnlockedRef.current) return;
      const a = roarAudioRef.current;
      if (!a) return;
      const prevVol = a.volume;
      a.volume = 0;
      const p = a.play();
      if (p === undefined) {
        a.volume = prevVol || 1;
        roarAudioUnlockedRef.current = true;
        return;
      }
      p.then(() => {
        a.pause();
        a.currentTime = 0;
        a.volume = prevVol || 1;
        roarAudioUnlockedRef.current = true;
      }).catch(() => {
        a.volume = prevVol || 1;
      });
    };
    window.addEventListener("pointerdown", primeAudio, true);
    window.addEventListener("keydown", primeAudio, true);
    return () => {
      window.removeEventListener("pointerdown", primeAudio, true);
      window.removeEventListener("keydown", primeAudio, true);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== cfg.input.jumpKey) return;
      if (modeRef.current === "dead") return;
      e.preventDefault();
      if (modeRef.current === "jump") return;
      modeRef.current = "jump";
      jumpTimeRef.current = 0;
      if (materialRef.current) {
        materialRef.current.map = jumpMap;
      }
      setAtlasFrame(jumpMap, 0, atlasJump);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cfg.input.jumpKey, jumpMap, atlasJump]);

  useFrame((_, delta) => {
    const mode = modeRef.current;
    const mat = materialRef.current;
    if (!mat) return;

    const alpha = cfg.material.alphaTest;

    if (mode === "run") {
      mat.map = runMap;
      mat.alphaTest = alpha;
      mat.color.setRGB(1, 1, 1);
      timeRef.current += delta;
      walkSecondsUntilRoarRef.current += delta;
      if (walkSecondsUntilRoarRef.current >= cfg.timers.secondsUntilRoar) {
        modeRef.current = "roar";
        roarTimeRef.current = 0;
        walkSecondsUntilRoarRef.current = 0;
        mat.map = roarMap;
        setAtlasFrame(roarMap, 0, atlasRoar);
        const sfx = roarAudioRef.current;
        if (sfx) {
          sfx.currentTime = 0;
          void sfx.play().catch(() => {});
        }
        return;
      }

      const frame = Math.floor(
        (timeRef.current * cfg.animation.runFramesPerSecond) % runFrames
      );
      setAtlasFrame(runMap, frame, atlasRun);

      const phase = timeRef.current * cfg.animation.walkPhaseSpeed;
      const x = Math.sin(phase) * cfg.walk.radiusWorldUnits;
      const facing = Math.cos(phase) >= 0 ? 1 : -1;
      if (groupRef.current) {
        groupRef.current.position.x = x;
        groupRef.current.scale.set(facing, 1, 1);
      }
      return;
    }

    if (mode === "roar") {
      mat.map = roarMap;
      mat.alphaTest = alpha;
      mat.color.setRGB(1, 1, 1);
      roarTimeRef.current += delta;
      const roarFps = cfg.animation.roarFramesPerSecond;
      const elapsedFrames = Math.floor(roarTimeRef.current * roarFps);
      const frame = Math.min(roarFrames - 1, elapsedFrames);
      setAtlasFrame(roarMap, frame, atlasRoar);
      const dur = roarDurationSecRef.current;
      if (roarTimeRef.current >= dur) {
        modeRef.current = "run";
        roarTimeRef.current = 0;
        walkSecondsUntilRoarRef.current = 0;
        mat.map = runMap;
        setAtlasFrame(runMap, 0, atlasRun);
        const sfx = roarAudioRef.current;
        if (sfx) {
          sfx.pause();
          sfx.currentTime = 0;
        }
        return;
      }
      return;
    }

    if (mode === "jump") {
      mat.map = jumpMap;
      mat.alphaTest = alpha;
      mat.color.setRGB(1, 1, 1);
      jumpTimeRef.current += delta;
      const jumpFps = cfg.animation.jumpFramesPerSecond;
      const elapsedJumpFrames = Math.floor(jumpTimeRef.current * jumpFps);
      if (elapsedJumpFrames >= jumpFrames) {
        modeRef.current = "run";
        jumpTimeRef.current = 0;
        mat.map = runMap;
        setAtlasFrame(runMap, 0, atlasRun);
        return;
      }
      const frame = Math.min(jumpFrames - 1, elapsedJumpFrames);
      setAtlasFrame(jumpMap, frame, atlasJump);
      return;
    }

    if (mode === "dead") {
      mat.map = deadMap;
      mat.alphaTest = alpha;
      mat.color.setRGB(1, 1, 1);
      deadTimeRef.current += delta;
      const deadFps = cfg.animation.deadFramesPerSecond;
      const elapsedDead = Math.floor(deadTimeRef.current * deadFps);
      if (elapsedDead >= deadFrames) {
        deadDoneRef.current = true;
      }
      const frame = Math.min(deadFrames - 1, elapsedDead);
      setAtlasFrame(deadMap, frame, atlasDead);
    }
  });

  useFrame(() => {
    if (!onModeChange) return;
    const m = modeRef.current;
    if (m !== prevReportedModeRef.current) {
      prevReportedModeRef.current = m;
      onModeChange(m);
    }
  });

  const handlePointerDown = (event) => {
    event.stopPropagation();
    if (modeRef.current !== "dead") {
      const sfx = roarAudioRef.current;
      if (sfx) {
        sfx.pause();
        sfx.currentTime = 0;
      }
      modeRef.current = "dead";
      deadTimeRef.current = 0;
      deadDoneRef.current = false;
      if (materialRef.current) {
        materialRef.current.map = deadMap;
        materialRef.current.color.setRGB(1, 1, 1);
      }
      setAtlasFrame(deadMap, 0, atlasDead);
      return;
    }
    if (deadDoneRef.current) {
      modeRef.current = "run";
      deadTimeRef.current = 0;
      deadDoneRef.current = false;
      walkSecondsUntilRoarRef.current = 0;
      if (materialRef.current) {
        materialRef.current.map = runMap;
        materialRef.current.color.setRGB(1, 1, 1);
      }
      setAtlasFrame(runMap, 0, atlasRun);
    }
  };

  return (
    <group
      ref={groupRef}
      position={[
        placement.positionX,
        placement.positionY + yLift,
        placement.positionZ + zNudge,
      ]}
      scale={[1, 1, 1]}
    >
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, -1, 1]}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[size.planeWidth, size.planeHeight]} />
        <meshBasicMaterial
          ref={materialRef}
          map={runMap}
          transparent
          alphaTest={material.alphaTest}
          depthWrite={material.depthWrite}
          toneMapped={material.toneMapped}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}
