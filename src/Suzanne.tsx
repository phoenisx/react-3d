import React, { Suspense, useRef } from "react";
import { Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, GroupProps, useFrame } from "@react-three/fiber";
import { Loader, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { useImmer } from "use-immer";
import { useSpring } from "react-spring";
import { a } from "react-spring/three";

import css from "./Suzanne.module.css";

type GLTFResult = GLTF & {
  nodes: {
    Suzanne: THREE.Mesh;
  };
  materials: Record<string, any>;
};

const SuzanneModel: React.FC<GroupProps> = props => {
  const rootRef = useRef<Group>(null);
  const { nodes } = useGLTF("https://gltf.pmnd.rs/suzanne.gltf") as GLTFResult;
  const [hovered, updateHovered] = useImmer(0);

  const [spring] = useSpring(
    {
      scale: hovered,
    },
    [hovered]
  );
  useFrame(() => rootRef.current && (rootRef.current.rotation.y += 0.01));

  const scale = spring.scale.to([0, 1], [1.0, 2.0]);

  return (
    <group ref={rootRef} {...props} dispose={null}>
      <a.mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
        scale={scale}
        onPointerOver={() => updateHovered(1)}
        onPointerOut={() => updateHovered(0)}
      />
    </group>
  );
};

const Suzanne: React.FC = () => (
  <div className={css.root}>
    <main className={css.main}>Hello World</main>
    <Canvas>
      <Suspense fallback={null}>
        <Stage environment="city">
          <SuzanneModel position={[0, 0, 0]} />
        </Stage>
      </Suspense>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
    </Canvas>
    <Loader />
  </div>
);

useGLTF.preload("https://gltf.pmnd.rs/suzanne.gltf");

export default Suzanne;
