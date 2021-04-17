import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import css from "./Bulb.module.css";

/**
 * References:
 * - https://codesandbox.io/embed/r3f-particles-i-q4d2v
 * - https://codesandbox.io/s/r3f-instanced-colors-w3lwy?file=/src/Effects.js
 */

const Source = () => {
  return (
    <>
      <pointLight distance={60} intensity={0.2} color="lightblue" />
      {/* @ts-ignore */}
      <instancedMesh args={[null, null, 1]}>
        <dodecahedronBufferGeometry args={[1, 0]} />
        <meshStandardMaterial color="black" />
      </instancedMesh>
    </>
  );
};

export const Bulb: React.FC = () => {
  return (
    <div className={`root ${css.root}`}>
      <Canvas className="root" camera={{ fov: 75, position: [0, 0, 70] }}>
        <pointLight intensity={0.2} color="white" />
        <spotLight
          intensity={0.2}
          position={[70, 70, 70]}
          penumbra={1}
          color="lightblue"
        />
        <Source />
        <OrbitControls />
      </Canvas>
    </div>
  );
};
