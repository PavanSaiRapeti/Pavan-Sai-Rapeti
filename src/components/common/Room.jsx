import { Text } from "@react-three/drei/core/Text";
import { useScroll } from "@react-three/drei/web/ScrollControls";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { buildUrl } from "../../../utils/urlBuilder";
import { TextureLoader } from "three";
import staticText from "../../content/staticText.json";
import DinoOnFloor from "./DinoOnFloor";

/** Hover narration only after this scroll fraction (0–1). */
const NARRATION_MIN_SCROLL = 0.5;

const Room = ({ onResumeClick, onDinoModeChange, onHoverNarration }) => {
  const scroll = useScroll();
  const roomRootRef = useRef(null);
  const narrScrollOkRef = useRef(false);
  const textures = useLoader(TextureLoader, [
    "/images/textures/resumeTexture.png",
    "/images/textures/aboutMe.png",
    "/images/textures/worldMap.png",
    "/images/textures/xMark.png",
  ]);
  const [resumeTexture, aboutTexture, worldTexture, xMark] = textures;
  const roomText = staticText.room;
  const flySpeech = staticText.flyGuide?.speech ?? {};
  const narrClearRef = useRef(null);

  const clearNarrationTimer = () => {
    if (narrClearRef.current) {
      window.clearTimeout(narrClearRef.current);
      narrClearRef.current = null;
    }
  };

  const showNarration = (speechKey) => {
    if (scroll.offset < NARRATION_MIN_SCROLL) return;
    const text = flySpeech[speechKey];
    if (!text) return;
    clearNarrationTimer();
    onHoverNarration?.(text);
  };

  const hideNarrationSoon = () => {
    clearNarrationTimer();
    narrClearRef.current = window.setTimeout(() => {
      onHoverNarration?.(null);
      narrClearRef.current = null;
    }, 160);
  };

  const fontArray = useMemo(() => [
    { text: roomText.fontLines[0], position: [-3.15, 0.7, 0.1], color: "#504B38" },
    { text: roomText.fontLines[1], position: [-0.6 - 2, 0.95, 0.1], color: "#ff9600" },
    { text: roomText.fontLines[2], position: [- 1.83, 1.27, 0.1], color: "#504B38" },
    {
      text: roomText.fontLines[3],
      position: [-2.2, 0.9, 0.1],
      color: "#504B38",
    },
    {
      text: roomText.fontLines[4],
      position: [-2.2, 0.7, 0.1],
      color: "#504B38",
    },
    {
      text: roomText.fontLines[5],
      position: [-2.2, 0.5, 0.1],
      color: "#504B38",
    },
    { text: roomText.fontLines[6], position: [-2.2, 0.3, 0.1], color: "#504B38" },
    { text: roomText.fontLines[7], position: [2.1, 0.85, 0.1], color: "#1F2937", key: "livingIn", font: true },
    { text: roomText.fontLines[8], position: [2.1, 0.7, 0.1], color: "#1F2937", key: "livingIn", font: true },
    { text: roomText.fontLines[9], position: [5, 0.15, 0.1], color: "#1F2937", key: "bornIn", font: true },
    { text: roomText.fontLines[10], position: [5 , 0.02, 0.1], color: "#1F2937", key: "bornIn", font: true }
  ], [roomText]);

  useFrame(() => {
    const fade = THREE.MathUtils.clamp(scroll.offset ?? 0, 0, 1);
    const narrOk = scroll.offset >= NARRATION_MIN_SCROLL;
    if (!narrOk && narrScrollOkRef.current) {
      clearNarrationTimer();
      onHoverNarration?.(null);
    }
    narrScrollOkRef.current = narrOk;

    roomRootRef.current?.traverse((obj) => {
      if (!obj.isMesh) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (let i = 0; i < mats.length; i += 1) {
        const m = mats[i];
        if (!m || typeof m.opacity !== "number") continue;
        if (m.userData._roomScrollBaseOpacity === undefined) {
          m.userData._roomScrollBaseOpacity = m.opacity;
          m.userData._roomScrollWasTransparent = !!m.transparent;
        }
        const base = m.userData._roomScrollBaseOpacity;
        m.opacity = base * fade;
        m.transparent =
          fade < 0.999 ||
          m.userData._roomScrollWasTransparent ||
          base < 0.999;
      }
    });
  });

  return (
    <group ref={roomRootRef}>
      <group
        position={[-4.9, -0.5, -0.9]}
        onClick={(event) => {
          event.stopPropagation();
          onResumeClick?.();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          clearNarrationTimer();
          showNarration("resumeStack");
        }}
        onPointerOut={hideNarrationSoon}
      >
        {[...Array(3)].map((_, index) => (
          <mesh
            key={index}
            position={[0, index * 0.01, 0]}
            rotation={[0, index * 0.1, 0]}
          >
            <boxGeometry args={[1, 0.01, 1.3]} />
            <meshStandardMaterial
              map={resumeTexture}
              args={[{ transparent: false, color: "#FFDEAD" }]}
            />
          </mesh>
        ))}
        <pointLight position={[0, 1, 0]} intensity={0.5} />
        <pointLight position={[0, 2, 0]} intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.5} />
      </group>
      <mesh
        position={[-2.6, -0.499, -1.3]}
        rotation={[-Math.PI / 2, 0, 0.1]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          clearNarrationTimer();
          showNarration("about");
        }}
        onPointerOut={hideNarrationSoon}
      >
        <planeGeometry
          args={[
            aboutTexture.image.width * 0.003,
            aboutTexture.image.height * 0.003,
          ]}
        />
        <meshStandardMaterial
          map={aboutTexture}
          args={[{ transparent: true, color: "#dcdddf" }]}
        />
      </mesh>
      <mesh
        position={[3.5, -0.4995, -0.5]}
        rotation={[-Math.PI / 2, 0, 0.1]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          clearNarrationTimer();
          showNarration("worldMap");
        }}
        onPointerOut={hideNarrationSoon}
      >
        <planeGeometry args={[7.5, 4.5]} />
        <meshStandardMaterial
          map={worldTexture}
          args={[{ transparent: true, color: "#F8F3D9" }]}
        />
        <mesh position={[1.6, -0.1, 0.01]} rotation={[0, 0, -0.2]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            map={xMark}
            args={[{ transparent: true, color: "yellow" }]}
          />
        </mesh>
        <mesh position={[-2.09, 0.6, 0.01]} rotation={[0, 0, -0.2]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial
            map={xMark}
            args={[{ transparent: true, color: "yellow" }]}
          />
        </mesh>

      </mesh>
      <Text
        position={[-5, -0.4, -1.7]}
        rotation={[-Math.PI / 2, 0, 0.2]}
        font={buildUrl("/fonts/child.ttf")}
        fontSize={0.15}
        textAlign="center"
        color="black"
        onClick={(event) => {
          event.stopPropagation();
          onResumeClick?.();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          clearNarrationTimer();
          showNarration("resumeLabel");
        }}
        onPointerOut={hideNarrationSoon}
      >
        {roomText.resumeLabel}
      </Text>
      <group
        position={[-4, -0.44, 1]}
        rotation={[-Math.PI / 2, 0, -0.3]}
        onPointerEnter={(e) => {
          e.stopPropagation();
          clearNarrationTimer();
          showNarration("hobbies");
        }}
        onPointerOut={hideNarrationSoon}
      >
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.8, 0.01]} />
          <meshStandardMaterial
            args={[{ transparent: false, color: "yellow" }]}
          />
        </mesh>
        <mesh position={[0, 0.05, 0.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshStandardMaterial
            map={resumeTexture}
            args={[{ transparent: true, color: "black" }]}
          />
        </mesh>
        <Text
          position={[0, -0.75, 0.02]}
          rotation={[0, 0, 0]}
          font={buildUrl("/fonts/child.ttf")}
          fontSize={0.15}
          textAlign="center"
          color="black"
        >
          {roomText.hobbiesLabel}
        </Text>
      </group>
      <DinoOnFloor onModeChange={onDinoModeChange} />
      <mesh
        receiveShadow
        position={[0, -0.55, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial />
        {fontArray.map((item, index) => (
          <Text
            key={index}
            position={item.position}
            rotation={!item.font ? [Math.PI, -Math.PI, Math.PI / 0.32] : [0, 0, 0]}
            font={item.font ? buildUrl("/fonts/Logo.ttf") : buildUrl("/fonts/child.ttf")}
            fontSize={item.font ?  0.12 : 0.17}
            textAlign="center"
            color={item.color}
          >
            {item.text}
          </Text>
        ))}
      </mesh>
    </group>
  );
};

export default Room;
