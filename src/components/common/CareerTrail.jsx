import { Text } from "@react-three/drei/core/Text";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";
import staticText from "../../content/staticText.json";
import { scrollVisibility, SCROLL_CHAPTERS } from "../../utils/scrollChapters";

/**
 * 3D career corridor — thick kraft monuments past the entrance poster zone.
 */
const CAREER_TRAIL_CONFIG = {
  card: {
    width: 0.92,
    height: 1.08,
    depth: 0.2,
    face: "#FFFDF8",
    kraft: "#C9A66B",
    wood: "#6E4E1C",
    paper: "#FFF8E8",
  },
  /** Straight aisle — nudged toward camera (front) */
  stations: [
    { x: -0.9, y: 2.05, z: 6.25, yaw: 0 },
    { x: 0.9, y: 2.08, z: 5.05, yaw: 0 },
    { x: -0.9, y: 2.05, z: 3.85, yaw: 0 },
    { x: 0.9, y: 2.08, z: 2.65, yaw: 0 },
    { x: -0.85, y: 2.05, z: 1.45, yaw: 0 },
    { x: 0.85, y: 2.08, z: 0.25, yaw: 0 },
  ],
};

function applyCardOpacity(matsRef, op) {
  const full = op >= 0.98;
  for (let i = 0; i < matsRef.current.length; i += 1) {
    const m = matsRef.current[i];
    if (!m) continue;
    const base = m.userData.baseOpacity ?? 1;
    if (full) {
      m.opacity = base;
      m.transparent = base < 0.999;
      m.depthWrite = true;
    } else {
      m.opacity = base * op;
      m.transparent = true;
      m.depthWrite = false;
    }
  }
}

function registerMat(matsRef, mat, baseOpacity = 1) {
  if (!mat || matsRef.current.includes(mat)) return;
  mat.userData.baseOpacity = baseOpacity;
  matsRef.current.push(mat);
}

function MonumentCard({
  station,
  layout,
  index,
  hovered,
  selected,
  childFont,
  logoFont,
  onHover,
  onLeave,
  onSelect,
  opacityRef,
}) {
  const groupRef = useRef(null);
  const matsRef = useRef([]);
  const cfg = CAREER_TRAIL_CONFIG.card;
  const phase = index * 0.9;

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 0.85 + phase) * 0.05;
    const lift = hovered || selected ? 0.12 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, layout.y + bob + lift, 7, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, layout.yaw, 6, dt);

    const op = opacityRef.current;
    applyCardOpacity(matsRef, op);
    g.visible = op > 0.04;
  });

  const faceZ = cfg.depth * 0.5 + 0.012;

  return (
    <group
      ref={groupRef}
      position={[layout.x, layout.y, layout.z]}
      rotation={[0, layout.yaw, 0]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (opacityRef.current < 0.25) return;
        onHover?.(station.speechKey);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onLeave?.();
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (opacityRef.current < 0.25) return;
        onSelect?.(station);
      }}
    >
      <mesh position={[0, -cfg.height * 0.56, 0]} castShadow>
        <boxGeometry args={[cfg.width * 0.58, 0.14, cfg.depth * 1.4]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.wood}
          roughness={0.88}
        />
      </mesh>
      <mesh position={[0, -cfg.height * 0.48, 0]}>
        <boxGeometry args={[cfg.width * 0.78, 0.09, cfg.depth * 1.2]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.kraft}
          roughness={0.82}
        />
      </mesh>

      <mesh castShadow receiveShadow>
        <boxGeometry args={[cfg.width, cfg.height, cfg.depth]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.face}
          roughness={0.62}
          metalness={0.02}
          emissive={hovered || selected ? station.accent : "#1a140c"}
          emissiveIntensity={hovered || selected ? 0.18 : 0.03}
        />
      </mesh>

      <mesh position={[-cfg.width * 0.5 - 0.012, 0, 0]}>
        <boxGeometry args={[0.05, cfg.height * 0.98, cfg.depth * 0.98]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.kraft}
          roughness={0.85}
        />
      </mesh>
      <mesh position={[cfg.width * 0.5 + 0.012, 0, 0]}>
        <boxGeometry args={[0.05, cfg.height * 0.98, cfg.depth * 0.98]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.kraft}
          roughness={0.85}
        />
      </mesh>

      {/* High-contrast paper face */}
      <mesh position={[0, 0.02, faceZ]}>
        <planeGeometry args={[cfg.width * 0.88, cfg.height * 0.78]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.paper}
          roughness={0.7}
        />
      </mesh>

      <mesh position={[0, cfg.height * 0.4, faceZ + 0.01]}>
        <boxGeometry args={[cfg.width * 0.82, 0.09, 0.04]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={station.accent}
          roughness={0.4}
          metalness={0.12}
        />
      </mesh>

      <mesh position={[0, 0.28, faceZ + 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.055, 28]} />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={station.accent}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      <Text
        position={[0, 0.28, faceZ + 0.09]}
        font={logoFont}
        fontSize={0.08}
        color="#FFFDF7"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#1e1e24"
        pointerEvents="none"
      >
        {station.year}
      </Text>

      <Text
        position={[0, 0.05, faceZ + 0.04]}
        font={childFont}
        fontSize={0.095}
        color="#1E1E24"
        anchorX="center"
        anchorY="middle"
        maxWidth={cfg.width * 0.84}
        textAlign="center"
        outlineWidth={0.005}
        outlineColor="#FFF8E8"
        pointerEvents="none"
      >
        {station.company}
      </Text>
      <Text
        position={[0, -0.12, faceZ + 0.04]}
        font={childFont}
        fontSize={0.055}
        color="#3A2F1C"
        anchorX="center"
        anchorY="middle"
        maxWidth={cfg.width * 0.86}
        textAlign="center"
        pointerEvents="none"
      >
        {station.role}
      </Text>
      <Text
        position={[0, -0.26, faceZ + 0.04]}
        font={childFont}
        fontSize={0.042}
        color="#5A5040"
        anchorX="center"
        anchorY="middle"
        maxWidth={cfg.width * 0.86}
        textAlign="center"
        pointerEvents="none"
      >
        {station.dates}
      </Text>
      <Text
        position={[0, -0.38, faceZ + 0.04]}
        font={childFont}
        fontSize={0.038}
        color="#F96E2A"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.002}
        outlineColor="#FFF8E8"
        pointerEvents="none"
      >
        click to open
      </Text>

      <pointLight
        position={[0.2, 0.5, 1.4]}
        intensity={hovered || selected ? 1.1 : 0.65}
        distance={5}
        color="#FFF0D4"
      />
    </group>
  );
}

/**
 * 3D career corridor — camera flies past monuments (after poster entrance).
 */
export default function CareerTrail({
  showNarration,
  hideNarrationSoon,
  clearNarrationTimer,
  onStationSelect,
  selectedStationId,
}) {
  const scroll = useScroll();
  const rootRef = useRef(null);
  const opacityRef = useRef(0);
  const career = staticText.career ?? {};
  const stations = career.stations ?? [];
  const childFont = buildUrl("/fonts/child.ttf");
  const logoFont = buildUrl("/fonts/Logo.ttf");
  const [hoveredId, setHoveredId] = useState(null);
  const layouts = CAREER_TRAIL_CONFIG.stations;
  const ambientRef = useRef(null);
  const dirRef = useRef(null);
  const pointRef = useRef(null);

  useFrame(() => {
    const op = scrollVisibility(scroll.offset ?? 0, SCROLL_CHAPTERS);
    opacityRef.current = op;
    const show = op > 0.04;
    if (rootRef.current) rootRef.current.visible = show;
    const lightMul = show ? op : 0;
    if (ambientRef.current) ambientRef.current.intensity = 0.28 * lightMul;
    if (dirRef.current) dirRef.current.intensity = 0.75 * lightMul;
    if (pointRef.current) pointRef.current.intensity = 0.6 * lightMul;
  });

  return (
    <group ref={rootRef} visible={false}>
      <ambientLight ref={ambientRef} intensity={0} />
      <directionalLight
        ref={dirRef}
        position={[1.5, 5, 8]}
        intensity={0}
        color="#FFF8E8"
      />
      <pointLight
        ref={pointRef}
        position={[0, 3, 7.5]}
        intensity={0}
        color="#FFB068"
        distance={12}
      />

      {/* aisle strip removed — straight card corridor only */}

      <Text
        position={[0, 2.85, 6.9]}
        font={childFont}
        fontSize={0.2}
        color="#1E1E24"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#F8EFD8"
        pointerEvents="none"
      >
        {career.title ?? "Career Trail"}
      </Text>
      <Text
        position={[0, 2.6, 6.9]}
        font={childFont}
        fontSize={0.085}
        color="#F96E2A"
        anchorX="center"
        anchorY="middle"
        pointerEvents="none"
      >
        {career.subtitle ?? "forged in code"}
      </Text>

      {stations.map((station, i) => {
        const layout = layouts[i];
        if (!layout) return null;
        return (
          <MonumentCard
            key={station.id}
            station={station}
            layout={layout}
            index={i}
            hovered={hoveredId === station.id}
            selected={selectedStationId === station.id}
            childFont={childFont}
            logoFont={logoFont}
            opacityRef={opacityRef}
            onHover={(key) => {
              clearNarrationTimer?.();
              setHoveredId(station.id);
              showNarration?.(key);
            }}
            onLeave={() => {
              setHoveredId(null);
              hideNarrationSoon?.();
            }}
            onSelect={(s) => {
              clearNarrationTimer?.();
              onStationSelect?.(s);
            }}
          />
        );
      })}
    </group>
  );
}
