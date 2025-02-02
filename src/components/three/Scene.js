import { Canvas } from "@react-three/fiber";
import { ScrollControls, OrbitControls, Html } from "@react-three/drei";
import CameraRig from "../common/CameraRig";
import DummyCamera from "../common/DummyCamera";
import Room from "../common/Room";
import PaperAnm from "../common/PaperAnm";
import { useEffect, useState } from "react";
import ScrollBlink from "../common/ScrollBlink";
import { useSelector } from "react-redux";
import { Physics, RigidBody } from "@react-three/rapier";
import Newspaper from "../common/Newspaper";

export default function Scene() {
  const [camera, setCamera] = useState(false);
  const isScroll =useSelector(state => state.camera.isScroll);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", margin: "0", position: "relative" }}>
      <button onClick={() => setCamera(prev => !prev)}>
        Change View
      </button>
      <Canvas shadows>
        <ScrollControls pages={2}>
            <Room />
            <PaperAnm />
          <DummyCamera isDefaultCamera={camera} />
          <CameraRig isDefaultCamera={!camera} />
          <Physics gravity={[0, -9.81, 0]}>
        <Newspaper />
        <RigidBody type="fixed">
          <mesh position={[0, -1, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </RigidBody>
      </Physics>
          {/* <PhysicsScene /> */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
          <OrbitControls enableZoom={false} enablePan={false} />
        </ScrollControls>
      </Canvas>
      {!isScroll ? <ScrollBlink /> : ''}
    </div>
  );
}