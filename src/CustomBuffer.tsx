import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const vertices = new Float32Array([
  /* eslint-disable prettier/prettier */
  -1.0, -1.0, 1.0,
   1.0, -1.0, 1.0,
   1.0,  1.0, 1.0,

   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0, -1.0,  1.0,
  /* eslint-enable prettier/prettier */
]);

export const CustomBuffer: React.FC = () => {
  const bufferGeometry = useRef<THREE.BufferGeometry>(null);

  // useEffect(() => {
  //   bufferGeometry.current?.setAttribute(
  //     "position",
  //     new BufferAttribute(vertices, 3)
  //   );
  // }, []);

  return (
    <>
      <Canvas className="root">
        <mesh rotation-z={1} rotation-y={1}>
          <bufferGeometry
            ref={bufferGeometry}
            attach="geometry"
            attributes={{
              position: new THREE.BufferAttribute(vertices, 3),
            }}
          />
          <meshBasicMaterial attach="material" color={0xf38999} />
        </mesh>
        <ambientLight />
        <pointLight />
      </Canvas>
    </>
  );
};
