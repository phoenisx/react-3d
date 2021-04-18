import { OrbitControls, Html } from "@react-three/drei";
import { Canvas, MeshProps } from "@react-three/fiber";
import { useControls } from "leva";
import React from "react";

import { add } from "../utils/math";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MeshExtraProps = {
  projection: number;
};

const BaseMesh: React.FC<Pick<MeshProps, "position" | "name">> = ({
  ...props
}) => (
  <group position={props.position}>
    <Html position={add(props.position || 0, [-0.5, 1.5, 0])}>
      <h1>{props.name}</h1>
    </Html>
    <mesh>
      <sphereBufferGeometry args={[1, 30, 30]} />
      {props.children}
    </mesh>
  </group>
);

enum Materials {
  Lambert = "lambert",
  Phong = "phong",
  Cartoon = "cartoon",
  Standard = "standard",
}

/**
 * Fastst -> Slowest Material chart:
 *  MeshBasicMaterial
 *    ➡ MeshLambertMaterial
 *      ➡ MeshPhongMaterial
 *        ➡ MeshStandardMaterial
 *          ➡ MeshPhysicalMaterial
 */

export const MaterialRoutes: React.FC = () => {
  const common = useControls({
    emissive: "#888",
    color: "#f67",
    position: [0, 0, 0],
    visible: {
      options: {
        Lambert: Materials.Lambert,
        Phong: Materials.Phong,
        Cartoon: Materials.Cartoon,
        Standard: Materials.Standard,
      },
    },
  });
  const phong = useControls("Phong", {
    shininess: { value: 30, min: 0, max: 300, step: 1 }, // default
  });
  const standard = useControls("Standard", {
    metalness: { value: 0, min: 0, max: 1, step: 0.001 },
    roughness: { value: 1, min: 0, max: 1, step: 0.001 },
  });
  return (
    <Canvas
      className="root"
      camera={{ far: 1500, position: [2.5, 0, 10], up: [0, 3, 0] }}
    >
      {common.visible === Materials.Lambert && (
        <BaseMesh name="Lambert" position={common.position}>
          <meshLambertMaterial
            emissive={(common.emissive as unknown) as THREE.Color}
            color={(common.color as unknown) as THREE.Color}
          />
        </BaseMesh>
      )}
      {common.visible === Materials.Phong && (
        <BaseMesh name="Phong" position={common.position}>
          <meshPhongMaterial
            emissive={(common.emissive as unknown) as THREE.Color}
            color={(common.color as unknown) as THREE.Color}
            {...phong}
          />
        </BaseMesh>
      )}
      {common.visible === Materials.Cartoon && (
        <BaseMesh name="Cartoon" position={common.position}>
          <meshToonMaterial
            emissive={(common.emissive as unknown) as THREE.Color}
            color={(common.color as unknown) as THREE.Color}
          />
        </BaseMesh>
      )}
      {common.visible === Materials.Standard && (
        <BaseMesh name="Standard" position={common.position}>
          <meshStandardMaterial
            emissive={(common.emissive as unknown) as THREE.Color}
            color={(common.color as unknown) as THREE.Color}
            {...standard}
          />
        </BaseMesh>
      )}
      <ambientLight intensity={0.3} color="#fff" />
      <pointLight intensity={3} position={[10, 10, 0]} color="#fff" />
      <gridHelper />
      <OrbitControls />
    </Canvas>
  );
};
