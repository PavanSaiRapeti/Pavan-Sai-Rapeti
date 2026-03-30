import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import * as CANNON from 'cannon-es';

const Newspaper = () => {
  const clothRef = useRef();
  const simulationRef = useRef(null);

  const Nx = 2;
  const Ny = 3;
  const mass = 0.1;
  const dist = 0.1;
  // Preload textures
  const [texture, bumpMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/images/textures/postertexture.jpg',
    '/images/textures/postertextureBUMP.jpg',
    '/images/textures/postertextureNORM.jpg'
  ]);

  const clothGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1, Nx, Ny), [Nx, Ny]);
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texture,
    roughness: 1,
    metalness: 1.5,
    bumpMap: bumpMap,
    bumpScale: 0.02,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.5, 0.5),
    transparent: true,
    alphaTest: 1
  }), [texture, bumpMap, normalMap]);

  if (!simulationRef.current) {
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -0.5, 0)
    });
    const shape = new CANNON.Particle();
    const particles = [];

    for (let i = 0; i < Nx + 1; i++) {
      particles.push([]);
      for (let j = 0; j < Ny + 1; j++) {
        const particle = new CANNON.Body({
          mass: j === Ny ? 0 : mass,
          shape,
          position: new CANNON.Vec3(0, (j - Ny) * dist, (i - Nx * 0.5) * dist),
          velocity: new CANNON.Vec3(0, 0, 0),
          linearDamping: 0.9,
          angularDamping: 0.9
        });
        particles[i].push(particle);
        world.addBody(particle);
      }
    }

    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        if (i < Nx) {
          world.addConstraint(new CANNON.DistanceConstraint(particles[i][j], particles[i + 1][j], dist));
        }
        if (j < Ny) {
          world.addConstraint(new CANNON.DistanceConstraint(particles[i][j], particles[i][j + 1], dist));
        }
      }
    }

    simulationRef.current = { world, particles };
  }

  useFrame(() => {
    if (!simulationRef.current) return;
    const { world, particles } = simulationRef.current;
    const positionAttribute = clothGeometry.attributes.position;

    // Update physics world
    world.step(1 / 60);

    // Update cloth vertices based on physics simulation
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        const index = j * (Nx + 1) + i;
        const position = particles[i][Ny - j].position;
        positionAttribute.setXYZ(index, position.x, position.y, position.z);

        // Add subtle movement without excessive allocations.
        const turbulence = new CANNON.Vec3(
          (Math.random() - 0.51) * 0.05,
          (Math.random() - 0.51) * 0.05,
          (Math.random() - 0.51) * 0.05
        );
        particles[i][j].applyForce(turbulence, particles[i][j].position);
      }
    }
    positionAttribute.needsUpdate = true;
  });

  return (
    <mesh ref={clothRef} geometry={clothGeometry} material={clothMat} />
  );
};

export default Newspaper;