import { Text } from "@react-three/drei/core/Text";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";
import staticText from "../../content/staticText.json";
import { scrollVisibility, SCROLL_CHAPTERS } from "../../utils/scrollChapters";

/**
 * Vertical ID cards — white body + black text only.
 */
const CAREER_TRAIL_CONFIG = {
  card: {
    width: 1.05,
    height: 1.55,
    depth: 0.028,
    radius: 0.07,
    white: "#FFFFFF",
    ink: "#111111",
    muted: "#555555",
  },
  stations: [
    { x: -1.15, y: 2.15, z: 6.25, yaw: 0.02 },
    { x: 1.15, y: 2.18, z: 5.05, yaw: -0.02 },
    { x: -1.15, y: 2.15, z: 3.85, yaw: 0.02 },
    { x: 1.15, y: 2.18, z: 2.65, yaw: -0.02 },
    { x: -1.1, y: 2.15, z: 1.45, yaw: 0.02 },
    { x: 1.1, y: 2.18, z: 0.25, yaw: -0.02 },
  ],
};

function roundedRectShape(w, h, r) {
  const hw = w * 0.5;
  const hh = h * 0.5;
  const s = new THREE.Shape();
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return s;
}

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

function parseDates(dates) {
  const parts = String(dates || "")
    .split(/[–—-]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return { join: parts[0], end: parts[1].split("·")[0].trim() };
  }
  if (parts.length === 1) {
    return { join: parts[0], end: "—" };
  }
  return { join: "—", end: "—" };
}

function IdBadgeCard({
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
  const phase = index * 0.85;
  const active = hovered || selected;
  const faceZ = cfg.depth * 0.5 + 0.012;
  const isFront = index % 2 === 0;
  const { join, end } = parseDates(station.dates);
  const idNo = String(12420000 + index * 137 + (station.year || "").length * 11);
  const stackLine = (station.stack || []).slice(0, 2).join(" · ");

  const bodyShape = useMemo(
    () => roundedRectShape(cfg.width, cfg.height, cfg.radius),
    [cfg.width, cfg.height, cfg.radius]
  );

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 0.85 + phase) * 0.03;
    g.position.y = THREE.MathUtils.damp(
      g.position.y,
      layout.y + bob + (active ? 0.1 : 0),
      8,
      dt
    );
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, layout.yaw, 7, dt);
    applyCardOpacity(matsRef, opacityRef.current);
    g.visible = opacityRef.current > 0.04;
  });

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
      <mesh
        position={[0.02, -cfg.height * 0.52, -0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[cfg.width * 0.9, 0.12]} />
        <meshBasicMaterial
          ref={(m) => registerMat(matsRef, m, 0.18)}
          color="#000000"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0, -cfg.depth * 0.5]}>
        <extrudeGeometry
          args={[bodyShape, { depth: cfg.depth, bevelEnabled: false }]}
        />
        <meshStandardMaterial
          ref={(m) => registerMat(matsRef, m)}
          color={cfg.white}
          roughness={0.55}
          metalness={0}
        />
      </mesh>

      {isFront ? (
        <>
          <Text
            position={[cfg.width * 0.4, cfg.height * 0.4, faceZ]}
            font={logoFont}
            fontSize={0.028}
            color={cfg.ink}
            anchorX="right"
            anchorY="middle"
            pointerEvents="none"
          >
            {`JOIN DATE: ${join}`}
          </Text>
          <Text
            position={[cfg.width * 0.4, cfg.height * 0.34, faceZ]}
            font={logoFont}
            fontSize={0.028}
            color={cfg.ink}
            anchorX="right"
            anchorY="middle"
            pointerEvents="none"
          >
            {`END DATE: ${end}`}
          </Text>

          <Text
            position={[0, -0.05, faceZ]}
            font={logoFont}
            fontSize={0.085}
            color={cfg.ink}
            anchorX="center"
            anchorY="middle"
            maxWidth={cfg.width * 0.88}
            textAlign="center"
            pointerEvents="none"
          >
            {station.company.toUpperCase()}
          </Text>
          <Text
            position={[0, -0.22, faceZ]}
            font={childFont}
            fontSize={0.038}
            color={cfg.muted}
            anchorX="center"
            anchorY="middle"
            maxWidth={cfg.width * 0.85}
            textAlign="center"
            pointerEvents="none"
          >
            {station.role}
          </Text>

          <Text
            position={[0, -cfg.height * 0.4, faceZ]}
            font={logoFont}
            fontSize={0.032}
            color={cfg.muted}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
            pointerEvents="none"
          >
            {`ID NO. ${idNo}`}
          </Text>
        </>
      ) : (
        <>
          <Text
            position={[0, cfg.height * 0.18, faceZ]}
            font={logoFont}
            fontSize={0.072}
            color={cfg.ink}
            anchorX="center"
            anchorY="middle"
            maxWidth={cfg.width * 0.88}
            textAlign="center"
            pointerEvents="none"
          >
            {station.company.toUpperCase()}
          </Text>

          <Text
            position={[0, -0.02, faceZ]}
            font={childFont}
            fontSize={0.038}
            color={cfg.ink}
            anchorX="center"
            anchorY="middle"
            maxWidth={cfg.width * 0.8}
            textAlign="center"
            pointerEvents="none"
          >
            {station.role}
          </Text>
          <Text
            position={[0, -0.14, faceZ]}
            font={logoFont}
            fontSize={0.03}
            color={cfg.muted}
            anchorX="center"
            anchorY="middle"
            maxWidth={cfg.width * 0.8}
            textAlign="center"
            pointerEvents="none"
          >
            {stackLine || station.dates}
          </Text>

          <Text
            position={[0, -cfg.height * 0.38, faceZ]}
            font={logoFont}
            fontSize={0.032}
            color={cfg.muted}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
            pointerEvents="none"
          >
            {`ID NO. ${idNo}`}
          </Text>
        </>
      )}

      <pointLight
        position={[0.08, 0.4, 0.85]}
        intensity={active ? 0.55 : 0.28}
        distance={3}
        color="#FFFFFF"
      />
    </group>
  );
}

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
    if (ambientRef.current) ambientRef.current.intensity = 0.6 * lightMul;
    if (dirRef.current) dirRef.current.intensity = 1.15 * lightMul;
    if (pointRef.current) pointRef.current.intensity = 0.35 * lightMul;
  });

  return (
    <group ref={rootRef} visible={false}>
      <ambientLight ref={ambientRef} intensity={0} />
      <directionalLight
        ref={dirRef}
        position={[1.5, 5, 8]}
        intensity={0}
        color="#FFFFFF"
      />
      <pointLight
        ref={pointRef}
        position={[0, 3, 7.5]}
        intensity={0}
        color="#FFFFFF"
        distance={12}
      />

      {stations.map((station, i) => {
        const layout = layouts[i];
        if (!layout) return null;
        return (
          <IdBadgeCard
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
