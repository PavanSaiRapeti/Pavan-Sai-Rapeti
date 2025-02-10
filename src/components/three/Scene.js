import { Canvas } from "@react-three/fiber";
import { ScrollControls, OrbitControls, Html } from "@react-three/drei";
import CameraRig from "../common/CameraRig";
import DummyCamera from "../common/DummyCamera";
import Room from "../common/Room";
import PaperAnm from "../common/PaperAnm";
import { useEffect, useState } from "react";
import ScrollBlink from "../common/ScrollBlink";
import { useDispatch, useSelector } from "react-redux";
import Newspaper from "../common/Newspaper";
import { setScroll } from "../../redux/actions/cameraActions";
import Overlay from "../Overlay";

export default function Scene() {
  const dispatch = useDispatch();
  const [camera, setCamera] = useState(false);
  const isScroll = useSelector(state => state.camera.isScroll);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden ">
    <div className="absolute inset-10 pointer-events-none z-10">
      <Overlay setCamera={setCamera} />
    </div>
    <Canvas style={{background:'#dcdddf'}} >
      <ScrollControls pages={2}>
        <Room />
        <DummyCamera isDefaultCamera={camera} />
        <CameraRig isDefaultCamera={!camera} />
        <PaperAnm />
        <directionalLight position={[5, 10, 5]} intensity={1}  />
        <OrbitControls enableZoom={false} enablePan={false} />
      </ScrollControls>
      
    </Canvas>
    {!isScroll ? <ScrollBlink /> : ''}
  </div>
  );
}