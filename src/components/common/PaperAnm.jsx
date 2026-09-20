import React, { useEffect, useMemo, useRef } from "react";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import * as THREE from "three";
import Newspaper from "./Newspaper";
import { useFrame } from "@react-three/fiber";
import {
  SCROLL_CHAPTERS,
  posterLiftProgress,
  posterFlyOffProgress,
} from "../../utils/scrollChapters";
import { posterClothState } from "../../utils/posterClothState";

/**
 * One continuous flow:
 * far (wavy) → approaches → attaches crossed on lens (flat cloth) → flies off from that cross (wavy).
 * No phase snaps — fly-off always starts from the stuck pose.
 */
const PaperAnm = () => {
  const paperRef = useRef();
  const lightRef = useRef();
  const scroll = useScroll();
  const smoothT = useRef(0);
  const smoothLift = useRef(0);
  const smoothFly = useRef(0);
  const scaleRef = useRef(0.45);
  const lightI = useRef(0);
  const bobPhase = useRef(0);
  const pos = useRef(new THREE.Vector3(0.35, -0.2, -9.4));
  const rot = useRef(new THREE.Euler(0.55, -0.35, 0.45));

  /** Start far in camera space */
  const farPos = useMemo(() => new THREE.Vector3(0.4, -0.25, -9.4), []);
  const farRot = useMemo(() => new THREE.Euler(0.62, -0.4, 0.5), []);

  /** Attached = lightly crossed on the lens (single shared pose for stick + fly start) */
  const stickPos = useMemo(() => new THREE.Vector3(0.02, -0.01, -1.05), []);
  const stickRot = useMemo(() => new THREE.Euler(0.07, -0.11, -0.2), []);

  /** Fly-off end — continues from cross, drifts up */
  const flyPos = useMemo(() => new THREE.Vector3(-0.15, 3.0, -1.5), []);
  const flyRot = useMemo(() => new THREE.Euler(0.35, 0.15, -0.55), []);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetRot = useMemo(() => new THREE.Euler(), []);

  useEffect(() => {
    const m = paperRef.current;
    if (!m) return;
    m.visible = false;
    m.position.copy(farPos);
    m.rotation.copy(farRot);
    pos.current.copy(farPos);
    rot.current.copy(farRot);
  }, [farPos, farRot]);

  useFrame(({ camera }, delta) => {
    const mesh = paperRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.045);
    const rawT = scroll.offset ?? 0;

    smoothT.current = THREE.MathUtils.damp(smoothT.current, rawT, 5.5, dt);
    const t = smoothT.current;

    if (rawT < SCROLL_CHAPTERS.posterLiftStart && t < SCROLL_CHAPTERS.posterLiftStart) {
      posterClothState.calm = 0;
      posterClothState.gust = 1;
      smoothLift.current = 0;
      smoothFly.current = 0;
      mesh.visible = false;
      lightI.current = THREE.MathUtils.damp(lightI.current, 0, 10, dt);
      if (lightRef.current) lightRef.current.intensity = lightI.current;
      return;
    }

    smoothLift.current = THREE.MathUtils.damp(
      smoothLift.current,
      posterLiftProgress(t),
      7.2,
      dt
    );
    const lift = smoothLift.current;

    // Fly only after attached — still continuous from stick pose
    const flyGoal = lift >= 0.96 ? posterFlyOffProgress(t) : 0;
    smoothFly.current = THREE.MathUtils.damp(
      smoothFly.current,
      flyGoal,
      6.0,
      dt
    );
    const flyAmt = smoothFly.current;

    mesh.visible = true;
    bobPhase.current += dt;
    const phase = bobPhase.current;

    // Cloth: strong wave in flight → soft residual wave when stuck → wave again on leave
    let calmTarget = 0;
    let gustTarget = 1;
    if (flyAmt > 0.015) {
      calmTarget = 0;
      gustTarget = 1;
    } else if (lift >= 0.96) {
      // Stuck on lens — keep a little paper wave (not fully flat)
      calmTarget = 0.78;
      gustTarget = 0.28;
    } else if (lift > 0.72) {
      calmTarget = 0.78 * ((lift - 0.72) / 0.24);
      gustTarget = THREE.MathUtils.lerp(1, 0.28, (lift - 0.72) / 0.24);
    }
    posterClothState.calm = THREE.MathUtils.damp(
      posterClothState.calm,
      calmTarget,
      flyAmt > 0.015 ? 14 : 9,
      dt
    );
    posterClothState.gust = THREE.MathUtils.damp(
      posterClothState.gust,
      gustTarget,
      flyAmt > 0.015 ? 14 : 9,
      dt
    );

    const stickDist = Math.abs(stickPos.z);
    const fovRad = THREE.MathUtils.degToRad(camera.fov ?? 50);
    const frustumH = 2 * stickDist * Math.tan(fovRad * 0.5);
    const fillScale = (frustumH * 0.94) / 1.45;

    if (mesh.parent !== camera) {
      camera.add(mesh);
      if (lightRef.current && lightRef.current.parent !== camera) {
        camera.add(lightRef.current);
      }
    }

    const easeLift = 1 - Math.pow(1 - lift, 2.35);
    const easeFly = flyAmt * flyAmt * (3 - 2 * flyAmt);

    // --- Continuous pose: far → stickCross → flyEnd ---
    // Wave decays to 0 as we attach, then grows again as we leave
    const approachWave = Math.max(0, 1 - easeLift);
    const leaveWave = Math.sin(easeFly * Math.PI);
    const wave = flyAmt > 0.001 ? leaveWave : approachWave;

    if (flyAmt > 0.001) {
      // Leave from the exact crossed stick pose
      targetPos.lerpVectors(stickPos, flyPos, easeFly);
      targetRot.set(
        THREE.MathUtils.lerp(stickRot.x, flyRot.x, easeFly),
        THREE.MathUtils.lerp(stickRot.y, flyRot.y, easeFly),
        THREE.MathUtils.lerp(stickRot.z, flyRot.z, easeFly)
      );
    } else {
      // Arrive into the crossed stick pose
      targetPos.lerpVectors(farPos, stickPos, easeLift);
      targetRot.set(
        THREE.MathUtils.lerp(farRot.x, stickRot.x, easeLift),
        THREE.MathUtils.lerp(farRot.y, stickRot.y, easeLift),
        THREE.MathUtils.lerp(farRot.z, stickRot.z, easeLift)
      );
    }

    // Soft paper flutter on top — fades out at stick, fades in on leave
    if (wave > 0.001) {
      targetPos.x += Math.sin(phase * 2.3) * 0.16 * wave;
      targetPos.y += Math.sin(phase * 2.9) * 0.1 * wave;
      targetRot.x += Math.sin(phase * 3.4) * 0.14 * wave;
      targetRot.y += Math.cos(phase * 2.5) * 0.1 * wave;
      targetRot.z += Math.sin(phase * 3.8) * 0.16 * wave;
    }

    const scaleTarget = flyAmt > 0.001
      ? THREE.MathUtils.lerp(fillScale, fillScale * 0.42, easeFly)
      : THREE.MathUtils.lerp(0.36, fillScale, easeLift);

    const lightTarget = flyAmt > 0.001
      ? THREE.MathUtils.lerp(0.18, 0.02, easeFly)
      : THREE.MathUtils.lerp(0.08, 0.18, easeLift);

    // Damp toward target so phase changes never pop
    const follow = flyAmt > 0.001 ? 9 : 11;
    const k = 1 - Math.exp(-follow * dt);
    pos.current.x += (targetPos.x - pos.current.x) * k;
    pos.current.y += (targetPos.y - pos.current.y) * k;
    pos.current.z += (targetPos.z - pos.current.z) * k;
    rot.current.x += (targetRot.x - rot.current.x) * k;
    rot.current.y += (targetRot.y - rot.current.y) * k;
    rot.current.z += (targetRot.z - rot.current.z) * k;

    mesh.position.copy(pos.current);
    mesh.rotation.set(rot.current.x, rot.current.y, rot.current.z);

    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, scaleTarget, 10, dt);
    mesh.scale.setScalar(scaleRef.current);

    mesh.visible = flyAmt < 0.97;

    lightI.current = THREE.MathUtils.damp(lightI.current, lightTarget, 8, dt);
    if (lightRef.current) {
      lightRef.current.position.set(
        pos.current.x,
        pos.current.y + 0.4,
        pos.current.z + 0.35
      );
      lightRef.current.intensity = lightI.current;
    }
  });

  return (
    <>
      <mesh
        ref={paperRef}
        rotation={[0, 0, 0]}
        renderOrder={4}
        scale={[0.45, 0.45, 0.45]}
        visible={false}
      >
        <Newspaper />
      </mesh>
      <pointLight
        ref={lightRef}
        intensity={0}
        distance={3.8}
        decay={2}
        color="#F5F0E6"
        castShadow={false}
      />
    </>
  );
};

export default PaperAnm;
