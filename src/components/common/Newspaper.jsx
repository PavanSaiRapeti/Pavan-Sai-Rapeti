import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { posterClothState } from "../../utils/posterClothState";

/**
 * Wavy in flight; soft residual paper wave when stuck on lens.
 */
const Newspaper = () => {
  const timeRef = useRef(0);
  const calmSmooth = useRef(0);
  const gustSmooth = useRef(1);

  const [texture, bumpMap, normalMap] = useLoader(THREE.TextureLoader, [
    "/images/textures/postertexture.jpg",
    "/images/textures/postertextureBUMP.jpg",
    "/images/textures/postertextureNORM.jpg",
  ]);

  useMemo(() => {
    const maps = [texture, bumpMap, normalMap];
    for (const tex of maps) {
      if (!tex) continue;
      tex.anisotropy = 8;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      if (THREE.SRGBColorSpace !== undefined && tex === texture) {
        tex.colorSpace = THREE.SRGBColorSpace;
      } else if (THREE.sRGBEncoding !== undefined && tex === texture) {
        tex.encoding = THREE.sRGBEncoding;
      }
      tex.needsUpdate = true;
    }
  }, [texture, bumpMap, normalMap]);

  const clothGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.15, 1.45, 24, 30);
    g.userData.base = Float32Array.from(g.attributes.position.array);
    return g;
  }, []);

  const clothMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: texture,
        color: "#c4c0b8",
        roughness: 0.98,
        metalness: 0,
        bumpMap,
        bumpScale: 0.006,
        normalMap,
        normalScale: new THREE.Vector2(0.18, 0.18),
        transparent: true,
        alphaTest: 0.08,
        depthWrite: true,
        envMapIntensity: 0,
      }),
    [texture, bumpMap, normalMap]
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;

    const calmTarget = THREE.MathUtils.clamp(posterClothState.calm ?? 0, 0, 1);
    const gustTarget = THREE.MathUtils.clamp(
      posterClothState.gust ?? 1 - calmTarget,
      0,
      1
    );
    calmSmooth.current = THREE.MathUtils.damp(
      calmSmooth.current,
      calmTarget,
      10,
      dt
    );
    gustSmooth.current = THREE.MathUtils.damp(
      gustSmooth.current,
      gustTarget,
      10,
      dt
    );

    const calm = calmSmooth.current;
    const gust = gustSmooth.current;
    // Never fully kill the wave — stuck pose keeps a gentle paper ripple
    const wind = Math.max(0.12, gust * (1 - calm * 0.88));

    const pos = clothGeometry.attributes.position;
    const base = clothGeometry.userData.base;
    const t = timeRef.current;
    // Strong in flight; soft when mostly calm
    const amp = THREE.MathUtils.lerp(0.022, 0.13, Math.min(1, wind));

    for (let i = 0; i < pos.count; i += 1) {
      const ix = i * 3;
      const x = base[ix];
      const y = base[ix + 1];
      const edgeX = Math.pow(Math.min(1, Math.abs(x) / 0.575), 1.35);
      const edgeY = Math.pow(Math.min(1, Math.abs(y) / 0.725), 1.15);
      const edge = 0.25 + edgeX * 0.55 + edgeY * 0.35;

      const wave =
        Math.sin(x * 4.6 + y * 1.8 + t * 3.2) * amp * edge +
        Math.sin(y * 5.4 - t * 2.4 + x * 1.2) * amp * 0.75 * edge +
        Math.sin((x + y) * 3.2 + t * 1.8) * amp * 0.35;

      pos.array[ix] = x;
      pos.array[ix + 1] = y;
      pos.array[ix + 2] = wave;
    }
    pos.needsUpdate = true;
    clothGeometry.computeVertexNormals();
  });

  return <mesh geometry={clothGeometry} material={clothMat} />;
};

export default Newspaper;
