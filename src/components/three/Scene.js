import { Canvas } from "@react-three/fiber";
import { ScrollControls, OrbitControls } from "@react-three/drei";
import CameraRig from "../common/CameraRig";

function Room() {
  return (
    <>
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 5, 10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Grid on the floor */}
      <gridHelper args={[20, 20, 'gray', 'gray']} position={[0, 0.01, 0]} />
    </>
  );
}

export default function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", margin: "0" }}>
      <Canvas shadows>
        <ScrollControls pages={1}>
          <CameraRig />
          <Room />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />
          <OrbitControls enableZoom={false} />
        </ScrollControls>
      </Canvas>
    </div>
  );
}