/**
 * Solar System Example for:
 * https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import {
  AxesHelperProps,
  Canvas,
  GroupProps,
  useFrame,
} from "@react-three/fiber";
import { useControls } from "leva";
import { AxesHelper, Mesh, Object3D } from "three";

const Rotate: React.FC<GroupProps> = props => {
  const ref = useRef<Object3D>(null);
  useFrame((_, time) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y += time;
  });
  return <group ref={ref} {...props} />;
};

const AxesHelperComp: React.FC<
  AxesHelperProps & { depthTest?: boolean }
> = props => {
  const ref = useRef<AxesHelper>(null);
  useEffect(() => {
    // @ts-ignore
    ref.current.material.depthTest = props.depthTest;
  }, [props.depthTest]);
  return <axesHelper ref={ref} {...props} />;
};

//#region Sphere Component
interface SphereProps {
  radius: number;
  wSeg: number;
  hSeg: number;
  color?: number;
  emissive?: number;
  scale?: number;
  x?: number;
  y?: number;
  z?: number;
  showGrid?: boolean;
}

const Sphere: React.FC<SphereProps> = ({
  scale = 1,
  x = 0,
  y = 0,
  z = 0,
  color = 0x000000,
  emissive = 0x000000,
  ...props
}) => {
  const ref = useRef<Mesh>(null);
  useFrame((_, time) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y += time;
  });

  return (
    <mesh ref={ref} scale={scale} position={[x, y, z]}>
      <sphereBufferGeometry args={[props.radius, props.wSeg, props.hSeg]} />
      <meshPhongMaterial
        color={(color as unknown) as THREE.Color}
        emissive={(emissive as unknown) as THREE.Color}
      />
      <AxesHelperComp depthTest={false} />
      {props.showGrid && <gridHelper />}
    </mesh>
  );
};
//#endregion

enum KEYS {
  WIDTH_SEGMENTS = "width segments",
  HEIGHT_SEGMENTS = "height segments",
}

export const SolarSystem: React.FC = () => {
  const pointLight = useControls("Light", {
    intensity: {
      value: 0.6,
      min: 0,
      max: 3,
    },
    color: "#fff",
    x: 0,
    y: 0,
  });
  const sphere = useControls("Sphere", {
    radius: 1,
    [KEYS.WIDTH_SEGMENTS]: {
      value: 10,
      min: 0,
      max: 20,
      step: 1,
    },
    [KEYS.HEIGHT_SEGMENTS]: {
      value: 10,
      min: 0,
      max: 20,
      step: 1,
    },
  });
  return (
    <Canvas
      style={{ background: "#f2f2f2" }}
      className="root"
      camera={{
        fov: 40,
        near: 0.1,
        far: 1000,
        position: [0, 60, 0],
        up: [0, 0, 1],
      }}
    >
      <Rotate>
        <Sphere
          radius={sphere.radius}
          wSeg={sphere[KEYS.WIDTH_SEGMENTS]}
          hSeg={sphere[KEYS.HEIGHT_SEGMENTS]}
          scale={5}
          emissive={0xcc9900}
          showGrid
        />
        <Rotate position={[10, 0, 0]}>
          <Sphere
            radius={sphere.radius}
            wSeg={sphere[KEYS.WIDTH_SEGMENTS]}
            hSeg={sphere[KEYS.HEIGHT_SEGMENTS]}
            emissive={0x112244}
            color={0x2233ff}
          />
          <Sphere
            radius={sphere.radius}
            wSeg={sphere[KEYS.WIDTH_SEGMENTS]}
            hSeg={sphere[KEYS.HEIGHT_SEGMENTS]}
            scale={0.5}
            x={2}
            emissive={0x222222}
            color={0x888888}
          />
        </Rotate>
      </Rotate>
      <ambientLight intensity={0.3} color="#fff" />
      <pointLight
        intensity={pointLight.intensity}
        position={[pointLight.x, pointLight.y, 0]}
        color={pointLight.color}
      />
      <OrbitControls />
    </Canvas>
  );
};
