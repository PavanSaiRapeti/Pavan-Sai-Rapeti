import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

/**
 * Scroll camera: hold through poster beat → straight career → straight desk.
 */
const CameraRig = ({ isDefaultCamera }) => {
  const scroll = useScroll();
  const cameraRef = useRef();
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
    smoothT.current = THREE.MathUtils.damp(smoothT.current, raw, 5.2, dt);
    const t = smoothT.current;

    if ((raw > 0 && !isScroll) || (raw === 0 && isScroll)) {
      dispatch(setScroll(raw > 0));
    }
    if ((raw > 0.95 && !isScrollToBtm) || (raw < 0.98 && isScroll)) {
      dispatch(setScrollBtm(raw > 0.98));
    }

    const sample = sampleCameraAtScroll(t);
    targetPosition.current.set(sample.x, sample.y, sample.z);
    targetRotX.current = sample.rotX;

    const cam = cameraRef.current;
    if (!cam) return;
    const nearDesk = t >= SCROLL_CHAPTERS.deskFadeFull;
    const holding = t <= SCROLL_CHAPTERS.posterHoldEnd;
    const inCareer =
      t > SCROLL_CHAPTERS.posterFlyOffEnd && t < SCROLL_CHAPTERS.careerFadeOutEnd;
    const follow = nearDesk ? 14 : holding ? 12 : inCareer ? 11 : 8;
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

export default CameraRig;
