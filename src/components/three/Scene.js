import { Canvas } from "@react-three/fiber";
import { ScrollControls, OrbitControls } from "@react-three/drei";
import CameraRig from "../common/CameraRig";
import DummyCamera from "../common/DummyCamera";
import Room from "../common/Room";
import PaperAnm from "../common/PaperAnm";
import { useState } from "react";

export default function Scene() {
  const [camera, setCamera] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", margin: "0" }}>
      <button onClick={() => setCamera(prev => !prev)}>
        Change View
      </button>
      <Canvas shadows>
        <ScrollControls pages={1}>
          <DummyCamera isDefaultCamera={camera} />
          <CameraRig isDefaultCamera={!camera} />
          <PaperAnm />
          <Room />
          {/* <PhysicsScene /> */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
          <OrbitControls enableZoom={false} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}