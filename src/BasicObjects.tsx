import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, MeshProps } from "@react-three/fiber";
import { Loader, PerspectiveCamera } from "@react-three/drei";

import css from "./BasicObjects.module.css";
import { useImmer } from "use-immer";

const Box: React.FC<MeshProps> = props => {
  return (
    <mesh {...props}>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" color={0xf95b3c} />
    </mesh>
  );
};

const Boxes: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      <Box />
    </group>
  );
};

export const BasicObjects: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, updateState] = useImmer({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    updateState(draft => {
      draft.width = rootRef.current?.clientWidth || 0;
      draft.height = rootRef.current?.clientHeight || 0;
    });
  }, []);

  return (
    <div ref={rootRef}>
      <Canvas className={css.root}>
        <Suspense fallback={null}>
          <Boxes />
        </Suspense>
        <PerspectiveCamera fov={35} aspect={state.width / state.height} />
        <ambientLight />
        <pointLight />
      </Canvas>
      <Loader />
    </div>
  );
};
