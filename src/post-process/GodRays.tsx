import { OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef } from "react";
import {
  EffectComposer,
  GodRays as PGodRays,
  HueSaturation,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import niceColors from "nice-color-palettes";
import { useImmer } from "use-immer";
import * as THREE from "three";

import { isRef } from "../utils";

import css from "./GodRays.module.css";

const COUNT = 10;
const matrixObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colors = new Array(COUNT)
  .fill(0)
  .map(() => niceColors[0][Math.floor(Math.random() * 5)]);

const Rectangle: React.FC = () => {
  const ref = useRef<THREE.InstancedMesh>(null);

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(1000)
          .fill(0)
          .flatMap((_, i) => tempColor.set(colors[i]).toArray())
      ),
    []
  );

  const sticks = useMemo(() => {
    const temp = [];
    for (let i = 0; i < COUNT; i++) {
      const t = Math.random() * 10;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -5 + Math.random() * 10;
      const zFactor = -5 + Math.random() * 10;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    sticks.forEach((stick, i) => {
      matrixObject.position.set(
        stick.mx + Math.random(),
        stick.my + Math.random(),
        stick.my + Math.random()
      );
      matrixObject.updateMatrix();
      // @ts-ignore
      ref.current.setMatrixAt(i, matrixObject.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!ref.current) {
      return;
    }
  });

  return (
    <instancedMesh ref={ref} args={[null, null, COUNT]}>
      <boxGeometry args={[0.1, 1, 0.75]}>
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshPhongMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
};

const Globe = React.forwardRef<THREE.Mesh | undefined>((_, ref) => {
  const mesh = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (mesh.current && isRef<THREE.Mesh>(ref)) {
      ref.current = mesh.current;
    }
  }, []);

  return (
    <Sphere ref={mesh} args={[1, 30, 30]}>
      <meshBasicMaterial color="#f3cc66" transparent />
    </Sphere>
  );
});

const Sun: React.FC = () => {
  const mesh = useRef<THREE.Mesh>();
  const [state, updateState] = useImmer({
    mounted: false,
  });

  useEffect(() => {
    updateState(draft => {
      draft.mounted = !!mesh.current;
    });
  }, []);

  const light = useControls("Sun", {
    intensity: 2,
    power: { value: 100 },
    decay: { value: 0.3 },
    distance: 0,
  });
  const { hue, saturation } = useControls("HueSaturation", {
    hue: {
      value: 2.93,
      min: 0,
      max: Math.PI * 2,
    },
    saturation: {
      value: 2.05,
      min: 0,
      max: Math.PI * 2,
    },
  });
  const godRays = useControls("God Rays", {
    enable: true,
    exposure: { value: 0.024, min: 0, max: 1, step: 0.0001 },
    decay: { value: 1, min: 0, max: 1, step: 0.001 },
    blur: { value: true },
  });
  const noise = useControls("Noise", {
    noise: {
      value: 0.47,
      min: 0,
      max: 1,
    },
  });

  return (
    <>
      <pointLight
        power={light.power}
        decay={light.decay}
        position={[0, 0, 0]}
        intensity={light.intensity}
        distance={light.distance}
        color="#fff"
      />
      <Globe ref={mesh} />
      {state.mounted && (
        <EffectComposer multisampling={0}>
          {
            /* Adds Bloom and Glare in all direction */
            <PGodRays
              sun={mesh.current as THREE.Mesh}
              exposure={godRays.exposure}
              decay={godRays.decay}
              blur={Number(godRays.blur)}
            />
          }
          <Noise
            opacity={noise.noise}
            premultiply
            blendFunction={BlendFunction.ADD}
          />
          <HueSaturation hue={hue} saturation={saturation} />

          <Vignette />
        </EffectComposer>
      )}
    </>
  );
};

export const GodRays: React.FC = () => {
  return (
    <Canvas
      className={`root ${css.root}`}
      linear
      camera={{
        fov: 75,
        far: 100,
        position: [0, 0, 8],
      }}
    >
      <ambientLight intensity={0.3} color="#fff" />
      {/* <pointLight intensity={2} position={[5, 5, 0]} color="#fff" /> */}
      <Rectangle />
      <Sun />
      <OrbitControls />
    </Canvas>
  );
};
