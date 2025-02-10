import React, { useRef } from 'react';
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import * as CANNON from 'cannon-es';

const Newspaper = () => {
  const clothRef = useRef();
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -0.5, 0)
  });

  const Nx = 3;
  const Ny = 4;
  const mass = 0.1;
  const dist = 0.1;
  const shape = new CANNON.Particle();
  const particles = [];

  // Preload textures
  const [texture, bumpMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/images/textures/postertexture.jpg',
    '/images/textures/postertextureBUMP.jpg',
    '/images/textures/postertextureNORM.jpg'
  ]);

  // Set the initial x-position to place the cloth vertically
  const initialXPosition = 0; // Centered vertically

  for (let i = 0; i < Nx + 1; i++) {
    particles.push([]);
    for (let j = 0; j < Ny + 1; j++) {
      const particle = new CANNON.Body({
        mass: j === Ny ? 0 : mass,
        shape,
        position: new CANNON.Vec3(initialXPosition , (j - Ny) * dist, (i - Nx * 0.5) * dist),
        velocity: new CANNON.Vec3(0, 0, 0),
        linearDamping: 0.9, // Add damping to reduce oscillation
        angularDamping: 0.9
      });
      particles[i].push(particle);
      world.addBody(particle);
    }
  }

  function connect(i1, j1, i2, j2) {
    const stiffness = 1e5;
    const damping = 0.1;
    world.addConstraint(new CANNON.DistanceConstraint(
      particles[i1][j1],
      particles[i2][j2],
      dist,
      stiffness,
      damping
    ));
  }

  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      if (i < Nx) connect(i, j, i + 1, j);
      if (j < Ny) connect(i, j, i, j + 1);
    }
  }

  const clothGeometry = new THREE.PlaneGeometry(1, 1, Nx, Ny);
  const clothMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texture,
    roughness: 12,
    metalness: 0.5,
    bumpMap: bumpMap,
    bumpScale: 0.02,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.5, 0.5),
    color: 0xffffff
  });

  useFrame(() => {
    // Update physics world
    world.step(1 / 60);

    // Update cloth vertices based on physics simulation
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        const index = j * (Nx + 1) + i;
        const positionAttribute = clothGeometry.attributes.position;
        const position = particles[i][Ny - j].position;
        positionAttribute.setXYZ(index, position.x, position.y, position.z);
        positionAttribute.needsUpdate = true;

        // Reduce turbulence
        const turbulence = new CANNON.Vec3(
          (Math.random() - 0.51) * 0.05,
          (Math.random() - 0.51) * 0.05,
          (Math.random() - 0.51) * 0.05
        );
        particles[i][j].applyForce(turbulence, particles[i][j].position);
      }
    }
    clothGeometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={clothRef} geometry={clothGeometry} material={clothMat} />
  );
};

export default Newspaper;