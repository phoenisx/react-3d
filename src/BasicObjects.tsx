import React, { useRef } from "react";
import { Canvas, MeshProps } from "@react-three/fiber";
import { Loader, OrbitControls } from "@react-three/drei";

import css from "./BasicObjects.module.css";
import { BackSide } from "three";

const Background = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[5, 10, 10]} attach="geometry" />
      <meshStandardMaterial
        color={0xd2452b}
        attach="material"
        side={BackSide}
        metalness={0.4}
      />
    </mesh>
  );
};

const Sphere: React.FC<MeshProps> = props => {
  return (
    <mesh {...props}>
      <sphereBufferGeometry attach="geometry" args={[0.7, 30, 30]} />
      <meshBasicMaterial attach="material" color={0x666666} />
    </mesh>
  );
};

const Box: React.FC<MeshProps> = props => {
  return (
    <mesh {...props} rotation-y={0.3}>
      <boxBufferGeometry attach="geometry" args={[0.2, 2, 0.2]} />
      <meshStandardMaterial attach="material" color={0xf95b3c} />
    </mesh>
  );
};

const Bulb: React.FC = () => {
  return (
    <group>
      <ambientLight intensity={0.9} />
      <pointLight intensity={1.12} position={[0, 0, 0]} />
      <Sphere position={[0, 0, 0]} />
    </group>
  );
};

export const BasicObjects: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className={css.root}>
      <Canvas>
        <Box position={[2, 2, 2]} />
        <Bulb />
        {/* <Background /> */}
        <OrbitControls />
        <gridHelper />
      </Canvas>
      <Loader />
    </div>
  );
};
