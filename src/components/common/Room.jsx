import React from 'react';

const Room = () => {
  return (
    <>
      {/* Floor (20m x 20m) */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Walls (20m x 10m x 0.1m) */}
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

      {/* Grid on the floor (20m x 20m) */}
      <gridHelper args={[20, 20, 'gray', 'gray']} position={[0, 0.01, 0]} />
    </>
  );
};

export default Room;
