import { Text } from "@react-three/drei/core/Text";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";
import staticText from "../../content/staticText.json";
import {
  drawableDimensions,
  subscribeDrawableReady,
} from "../../utils/spriteMosaicStrip";
import { SCROLL_CHAPTERS, DESK_WORLD_Z } from "../../utils/scrollChapters";

const MAILBOX_HEIGHT = 1.15;
const MAILBOX_SRC = "/images/mailbox.png?v=2";

function keyBlackBackground(source) {
  const { w, h } = drawableDimensions(source);
  if (!w || !h) return null;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0);
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const a = d[i + 3];
    if (a < 12) {
      d[i + 3] = 0;
      continue;
    }
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const chroma = max - min;
    if (lum < 28 || (lum < 48 && chroma < 18)) {
      d[i + 3] = 0;
    } else if (lum < 70 && chroma < 12) {
      d[i + 3] = Math.min(d[i + 3], Math.round(((lum - 48) / 22) * 255));
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Mailbox sprite — hover shows usage text (Logo font).
 */
export default function DeskMailbox({ onClick }) {
  const rootRef = useRef(null);
  const billboardRef = useRef(null);
  const matRef = useRef(null);
  const mailboxKeyedRef = useRef(false);
  const scroll = useScroll();
  const [aspect, setAspect] = useState(0.55);
  const [hovered, setHovered] = useState(false);
  const logoFont = buildUrl("/fonts/Logo.ttf");
  const tipCopy =
    staticText.mailbox?.dream ??
    "Click to leave a note. Inbox stays locked.";

  const mailboxTex = useLoader(THREE.TextureLoader, MAILBOX_SRC);

  useEffect(() => {
    let cancelled = false;
    mailboxKeyedRef.current = false;
    const apply = () => {
      if (cancelled || mailboxKeyedRef.current) return;
      const keyed = keyBlackBackground(mailboxTex.image);
      if (!keyed) return;
      mailboxKeyedRef.current = true;
      const { w, h } = drawableDimensions(keyed);
      if (w && h) setAspect(w / h);
      mailboxTex.image = keyed;
      mailboxTex.needsUpdate = true;
      mailboxTex.colorSpace = THREE.SRGBColorSpace;
      mailboxTex.anisotropy = 8;
      mailboxTex.minFilter = THREE.LinearFilter;
      mailboxTex.magFilter = THREE.LinearFilter;
      mailboxTex.premultiplyAlpha = false;
    };
    return subscribeDrawableReady(mailboxTex.image, apply);
  }, [mailboxTex]);

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
    if (matRef.current) {
      matRef.current.opacity = op;
      matRef.current.transparent = true;
      matRef.current.depthWrite = false;
    }
  });

  const w = MAILBOX_HEIGHT * aspect;
  const h = MAILBOX_HEIGHT;

  return (
    <group
      ref={rootRef}
      position={[6.85, -0.5, DESK_WORLD_Z + 3.2]}
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
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "";
          setHovered(false);
        }}
      >
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={matRef}
            map={mailboxTex}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
            alphaTest={0.08}
          />
        </mesh>

        {hovered ? (
          <Text
            position={[-w * 0.35, h * 0.62, 0.04]}
            font={logoFont}
            fontSize={0.085}
            color="#1a1a1a"
            outlineWidth={0.004}
            outlineColor="#FFFDF6"
            anchorX="center"
            anchorY="bottom"
            maxWidth={1.6}
            textAlign="center"
            lineHeight={1.2}
            pointerEvents="none"
          >
            {tipCopy}
          </Text>
        ) : null}
      </group>
    </group>
  );
}
