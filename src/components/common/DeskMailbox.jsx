import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  drawableDimensions,
  subscribeDrawableReady,
} from "../../utils/spriteMosaicStrip";
import { SCROLL_CHAPTERS, DESK_WORLD_Z } from "../../utils/scrollChapters";

const MAILBOX_HEIGHT = 1.6;

/** Punch solid black plate out of the shared mailbox PNG. */
function keyBlackBackground(source, luminanceMax = 0.12) {
  const { w, h } = drawableDimensions(source);
  if (!w || !h) return null;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255;
    const g = d[i + 1] / 255;
    const b = d[i + 2] / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum <= luminanceMax) d[i + 3] = 0;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Shared 2D mailbox art — floats facing the screen (not on the desk).
 */
export default function DeskMailbox({
  onClick,
  onPointerEnter,
  onPointerOut,
}) {
  const rootRef = useRef(null);
  const billboardRef = useRef(null);
  const matRef = useRef(null);
  const scroll = useScroll();
  const [aspect, setAspect] = useState(0.72);

  const rawTexture = useLoader(THREE.TextureLoader, "/images/mailbox.png");

  useEffect(() => {
    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const img = rawTexture.image;
      const keyed = keyBlackBackground(img);
      if (!keyed) return;
      const { w, h } = drawableDimensions(keyed);
      if (w && h) setAspect(w / h);
      rawTexture.image = keyed;
      rawTexture.needsUpdate = true;
      rawTexture.colorSpace = THREE.SRGBColorSpace;
      rawTexture.anisotropy = 8;
      rawTexture.minFilter = THREE.LinearFilter;
      rawTexture.magFilter = THREE.LinearFilter;
    };
    const unsub = subscribeDrawableReady(rawTexture.image, apply);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [rawTexture]);

  useFrame((state) => {
    const billboard = billboardRef.current;
    if (billboard) {
      billboard.quaternion.copy(state.camera.quaternion);
    }

    const s = scroll.offset ?? 0;
    const a = SCROLL_CHAPTERS.deskFadeStart;
    const b = SCROLL_CHAPTERS.deskFadeFull;
    let op = 0;
    if (s >= b) op = 1;
    else if (s > a) op = (s - a) / Math.max(0.001, b - a);

    if (rootRef.current) rootRef.current.visible = op > 0.04;
    const mat = matRef.current;
    if (mat) {
      mat.opacity = op;
      mat.transparent = true;
      mat.depthWrite = false;
    }
  });

  const w = MAILBOX_HEIGHT * aspect;
  const h = MAILBOX_HEIGHT;

  return (
    <group
      ref={rootRef}
      position={[3.55, 3.35, DESK_WORLD_Z + 0.35]}
      visible={false}
    >
      <group
        ref={billboardRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onPointerEnter?.(e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "";
          onPointerOut?.(e);
        }}
      >
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={matRef}
            map={rawTexture}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
            alphaTest={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}
