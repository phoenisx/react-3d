import React, { Suspense, useRef } from "react";
import { Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, GroupProps, useFrame } from "@react-three/fiber";
import { Loader, OrbitControls, Stage, useGLTF } from "@react-three/drei";

import "./App.css";

type GLTFResult = GLTF & {
  nodes: {
    Suzanne: THREE.Mesh;
  };
  materials: Record<string, any>;
};

const SuzanneModel: React.FC<GroupProps> = props => {
  const rootRef = useRef<Group>(null);
  const { nodes } = useGLTF("https://gltf.pmnd.rs/suzanne.gltf") as GLTFResult;

  useFrame(() => rootRef.current && (rootRef.current.rotation.y += 0.01));

  return (
    <group ref={rootRef} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
      />
    </group>
  );
};

const App: React.FC = () => (
  <>
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
  </>
);

useGLTF.preload("https://gltf.pmnd.rs/suzanne.gltf");

export default App;
