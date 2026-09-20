import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import * as THREE from "three";
import { useDispatch, useSelector } from "react-redux";
import { setScroll, setScrollBtm } from "../../redux/actions/cameraActions";
import {
  CAMERA_KEYS,
  SCROLL_CHAPTERS,
  sampleCameraAtScroll,
} from "../../utils/scrollChapters";

/** Desk framing was tuned at ~16:9; keep that horizontal span on resize/fullscreen. */
const DESK_REF_ASPECT = 16 / 9;

/**
 * Scroll camera — tracks offset tightly both ways (forward + reverse).
 */
const CameraRig = ({ isDefaultCamera }) => {
  const scroll = useScroll();
  const cameraRef = useRef();
  const { size } = useThree();
  const dispatch = useDispatch();
  const { isScroll, isScrollToBtm } = useSelector((state) => state.camera);
  const smoothT = useRef(0);
  const targetPosition = useRef(
    new THREE.Vector3(
      CAMERA_KEYS.entrance.x,
      CAMERA_KEYS.entrance.y,
      CAMERA_KEYS.entrance.z
    )
  );
  const targetRotX = useRef(0);

  useFrame((_, delta) => {
    const raw = scroll.offset ?? 0;
    const dt = Math.min(delta, 0.05);
    // Catch up faster when scrolling back so reverse doesn’t feel sticky
    const reversing = raw < smoothT.current - 0.001;
    const scrollLambda = reversing ? 16 : 9;
    smoothT.current = THREE.MathUtils.damp(
      smoothT.current,
      raw,
      scrollLambda,
      dt
    );
    const t = smoothT.current;

    if ((raw > 0.004 && !isScroll) || (raw <= 0.004 && isScroll)) {
      dispatch(setScroll(raw > 0.004));
    }
    if ((raw > 0.95 && !isScrollToBtm) || (raw < 0.98 && isScroll)) {
      dispatch(setScrollBtm(raw > 0.98));
    }

    const sample = sampleCameraAtScroll(t);
    let y = sample.y;
    // Top-down desk: vertical FOV + taller fullscreen shrinks world-X → feels like a left zoom.
    // Scale height so horizontal coverage stays matched to the reference aspect.
    if (t > SCROLL_CHAPTERS.deskFadeStart) {
      const aspect = size.height > 0 ? size.width / size.height : DESK_REF_ASPECT;
      const deskBlend =
        (t - SCROLL_CHAPTERS.deskFadeStart) /
        Math.max(0.001, 1 - SCROLL_CHAPTERS.deskFadeStart);
      const aspectScale = THREE.MathUtils.clamp(
        DESK_REF_ASPECT / Math.max(aspect, 0.5),
        0.85,
        1.35
      );
      y = sample.y * THREE.MathUtils.lerp(1, aspectScale, easeDesk(deskBlend));
    }
    targetPosition.current.set(sample.x, y, sample.z);
    targetRotX.current = sample.rotX;

    const cam = cameraRef.current;
    if (!cam) return;
    const nearDesk = t >= SCROLL_CHAPTERS.deskFadeFull;
    const follow = reversing ? 18 : nearDesk ? 14 : 12;
    cam.position.lerp(targetPosition.current, 1 - Math.exp(-follow * dt));
    cam.rotation.x = THREE.MathUtils.damp(
      cam.rotation.x,
      targetRotX.current,
      follow,
      dt
    );
    cam.rotation.y = THREE.MathUtils.damp(cam.rotation.y, 0, follow, dt);
    cam.rotation.z = 0;
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault={isDefaultCamera}
      position={[
        CAMERA_KEYS.entrance.x,
        CAMERA_KEYS.entrance.y,
        CAMERA_KEYS.entrance.z,
      ]}
      fov={50}
    />
  );
};

function easeDesk(u) {
  const x = u < 0 ? 0 : u > 1 ? 1 : u;
  return x * x * (3 - 2 * x);
}

export default CameraRig;
