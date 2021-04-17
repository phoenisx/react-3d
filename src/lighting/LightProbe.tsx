import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { useControls } from "leva";

export const LightProbe: React.FC = () => {
  const { test } = useControls({ test: "String" });

  return (
    <>
      <span>{test}</span>
      <Canvas className="root">
        <OrbitControls />
      </Canvas>
    </>
  );
};
