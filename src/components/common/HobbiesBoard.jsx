import { Text } from "@react-three/drei/core/Text";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";
import staticText from "../../content/staticText.json";

/**
 * Desk corkboard — edit layout / colors here only.
 * Warm cream · orange · kraft palette; cards sized for desk readability.
 */
const HOBBIES_BOARD_CONFIG = {
  /**
   * Desk top-down frustum (fov 50, cam y≈7.6) ≈ X ±5–6, Z ≈ −3…+3.5.
   * Sit lower-left of the desk, clear of résumé (−4.9, −0.9) / about (−2.6, −1.3).
   */
  placement: {
    position: [-3.55, -0.28, 1.95],
    rotation: [-Math.PI / 2, 0, -0.12],
  },
  board: {
    width: 2.55,
    height: 2.8,
    thickness: 0.042,
    color: "#B8894A",
    edgeColor: "#6E4E1C",
  },
  kraftOverlay: {
    color: "#F3E6C8",
    opacity: 0.22,
  },
  title: {
    fontSize: 0.2,
    color: "#2C2416",
    y: 1.16,
  },
  sticky: {
    width: 0.5,
    height: 0.28,
    color: "#FFE9A8",
    position: [0.88, 1.14, 0.032],
    rotationZ: -0.1,
    fontSize: 0.062,
    colorText: "#3A2F1C",
  },
  polaroid: {
    frameW: 0.98,
    frameH: 0.62,
    photoW: 0.85,
    photoH: 0.35,
    frameColor: "#FFFDF7",
    liftZ: 0.05,
  },
  polaroids: [
    { x: -0.57, y: 0.57, z: 0.04, rotZ: -0.06, pin: "#E85D4C" },
    { x: 0.57, y: 0.57, z: 0.04, rotZ: 0.07, pin: "#4A90A4" },
    { x: -0.57, y: -0.12, z: 0.04, rotZ: 0.05, pin: "#6B8F71" },
    { x: 0.57, y: -0.12, z: 0.04, rotZ: -0.05, pin: "#C47A1A" },
    { x: -0.57, y: -0.82, z: 0.04, rotZ: -0.04, pin: "#8B5A9E" },
    { x: 0.57, y: -0.82, z: 0.04, rotZ: 0.06, pin: "#3D6B8A" },
  ],
  pin: {
    radius: 0.036,
    y: 0.27,
  },
};

function makeCorkTexture() {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#B8894A";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1600; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.6 + Math.random() * 2.6;
    const shade = 140 + Math.floor(Math.random() * 75);
    ctx.fillStyle = `rgba(${shade}, ${shade - 28}, ${shade - 58}, ${0.18 + Math.random() * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.4, 2.6);
  if (THREE.sRGBEncoding !== undefined) {
    tex.encoding = THREE.sRGBEncoding;
  } else if (THREE.SRGBColorSpace !== undefined) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  return tex;
}

function HobbyIcon({ type, accent }) {
  const mat = (
    <meshStandardMaterial color={accent} roughness={0.45} metalness={0.05} />
  );
  switch (type) {
    case "ball":
      return (
        <mesh position={[0, 0, 0.01]} scale={0.09}>
          <sphereGeometry args={[1, 16, 16]} />
          {mat}
        </mesh>
      );
    case "mountain":
      return (
        <group position={[0, -0.02, 0.01]}>
          <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.14, 0.14, 0.02]} />
            {mat}
          </mesh>
          <mesh position={[0.07, -0.01, 0.005]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.11, 0.11, 0.02]} />
            {mat}
          </mesh>
        </group>
      );
    case "music":
      return (
        <group position={[0, 0, 0.01]}>
          <mesh position={[-0.05, 0, 0]}>
            <boxGeometry args={[0.03, 0.16, 0.02]} />
            {mat}
          </mesh>
          <mesh position={[0.02, 0.02, 0]}>
            <boxGeometry args={[0.03, 0.12, 0.02]} />
            {mat}
          </mesh>
          <mesh position={[0.09, 0.04, 0]}>
            <boxGeometry args={[0.03, 0.08, 0.02]} />
            {mat}
          </mesh>
        </group>
      );
    case "camera":
      return (
        <group position={[0, 0, 0.01]}>
          <mesh>
            <boxGeometry args={[0.18, 0.12, 0.03]} />
            {mat}
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#1A1A1A" roughness={0.5} />
          </mesh>
        </group>
      );
    case "video":
      return (
        <mesh position={[0.02, 0, 0.01]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.14, 3]} />
          {mat}
        </mesh>
      );
    case "cube":
      return (
        <mesh position={[0, 0, 0.015]} rotation={[0.4, 0.55, 0.15]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          {mat}
        </mesh>
      );
    default:
      return null;
  }
}

function PolaroidCard({
  hobby,
  layout,
  hovered,
  onHover,
  onLeave,
  childFont,
}) {
  const groupRef = useRef(null);
  const cfg = HOBBIES_BOARD_CONFIG.polaroid;
  const pinCfg = HOBBIES_BOARD_CONFIG.pin;
  const zRef = useRef(layout.z);

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    zRef.current = THREE.MathUtils.damp(
      zRef.current,
      hovered ? layout.z + cfg.liftZ : layout.z,
      12,
      dt
    );
    g.position.z = zRef.current;
    const wantRot = hovered ? layout.rotZ * 0.3 : layout.rotZ;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, wantRot, 10, dt);
  });

  return (
    <group
      ref={groupRef}
      position={[layout.x, layout.y, layout.z]}
      rotation={[0, 0, layout.rotZ]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover?.(hobby.speechKey);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onLeave?.();
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[cfg.frameW, cfg.frameH, 0.014]} />
        <meshStandardMaterial color={cfg.frameColor} roughness={0.8} />
      </mesh>

      {/* High-contrast photo band */}
      <mesh position={[0, 0.05, 0.009]}>
        <planeGeometry args={[cfg.photoW, cfg.photoH]} />
        <meshStandardMaterial color={hobby.photo} roughness={0.65} />
      </mesh>

      <group position={[-0.26, 0.05, 0.02]}>
        <HobbyIcon type={hobby.icon} accent={hobby.accent} />
      </group>

      <Text
        position={[0.14, 0.08, 0.02]}
        font={childFont}
        fontSize={0.095}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#1A140C"
        maxWidth={0.48}
        textAlign="center"
        pointerEvents="none"
      >
        {hobby.title}
      </Text>
      <Text
        position={[0.14, -0.02, 0.02]}
        font={childFont}
        fontSize={0.05}
        color={hobby.accent}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.48}
        textAlign="center"
        pointerEvents="none"
      >
        {hobby.subtitle}
      </Text>

      {/* Caption strip under photo */}
      <Text
        position={[0, -0.2, 0.012]}
        font={childFont}
        fontSize={0.055}
        color="#2C2416"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#FFFDF7"
        pointerEvents="none"
      >
        {hobby.title}
      </Text>

      <mesh position={[0, pinCfg.y, 0.022]}>
        <sphereGeometry args={[pinCfg.radius, 16, 16]} />
        <meshStandardMaterial
          color={layout.pin}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, pinCfg.y, 0.006]}>
        <cylinderGeometry args={[0.009, 0.009, 0.032, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

/**
 * Scrapbook hobbies corkboard for the desk floor.
 */
export default function HobbiesBoard({
  showNarration,
  hideNarrationSoon,
  clearNarrationTimer,
}) {
  const cfg = HOBBIES_BOARD_CONFIG;
  const roomText = staticText.room;
  const hobbies = roomText.hobbies ?? [];
  const childFont = buildUrl("/fonts/child.ttf");
  const [hoveredId, setHoveredId] = useState(null);
  const corkMap = useMemo(() => makeCorkTexture(), []);

  const onPolaroidEnter = (speechKey, id) => {
    clearNarrationTimer?.();
    setHoveredId(id);
    showNarration?.(speechKey);
  };

  const onPolaroidLeave = () => {
    setHoveredId(null);
    hideNarrationSoon?.();
  };

  return (
    <group
      position={cfg.placement.position}
      rotation={cfg.placement.rotation}
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (hoveredId) return;
        clearNarrationTimer?.();
        showNarration?.("hobbies");
      }}
      onPointerOut={hideNarrationSoon}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[cfg.board.width, cfg.board.height, cfg.board.thickness]}
        />
        <meshStandardMaterial
          map={corkMap || undefined}
          color={corkMap ? "#ffffff" : cfg.board.color}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 0, cfg.board.thickness * 0.5 + 0.001]}>
        <planeGeometry
          args={[cfg.board.width * 0.96, cfg.board.height * 0.96]}
        />
        <meshStandardMaterial
          color={cfg.kraftOverlay.color}
          transparent
          opacity={cfg.kraftOverlay.opacity}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -cfg.board.thickness * 0.35]}>
        <boxGeometry
          args={[
            cfg.board.width + 0.05,
            cfg.board.height + 0.05,
            cfg.board.thickness * 0.5,
          ]}
        />
        <meshStandardMaterial color={cfg.board.edgeColor} roughness={0.88} />
      </mesh>

      <Text
        position={[0, cfg.title.y, 0.025]}
        font={childFont}
        fontSize={cfg.title.fontSize}
        color={cfg.title.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#F8EFD8"
        pointerEvents="none"
      >
        {roomText.hobbiesLabel}
      </Text>

      <group
        position={cfg.sticky.position}
        rotation={[0, 0, cfg.sticky.rotationZ]}
      >
        <mesh>
          <planeGeometry args={[cfg.sticky.width, cfg.sticky.height]} />
          <meshStandardMaterial color={cfg.sticky.color} roughness={0.75} />
        </mesh>
        <Text
          position={[0, 0, 0.006]}
          font={childFont}
          fontSize={cfg.sticky.fontSize}
          color={cfg.sticky.colorText}
          anchorX="center"
          anchorY="middle"
          maxWidth={cfg.sticky.width * 0.88}
          textAlign="center"
          pointerEvents="none"
        >
          {roomText.hobbiesNote}
        </Text>
      </group>

      {hobbies.map((hobby, i) => {
        const layout = cfg.polaroids[i];
        if (!layout) return null;
        return (
          <PolaroidCard
            key={hobby.id}
            hobby={hobby}
            layout={layout}
            hovered={hoveredId === hobby.id}
            childFont={childFont}
            onHover={(speechKey) => onPolaroidEnter(speechKey, hobby.id)}
            onLeave={onPolaroidLeave}
          />
        );
      })}
    </group>
  );
}
