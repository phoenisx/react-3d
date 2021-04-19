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

const xColors = [
  "#722D28",
  "#6D7228",
  "#725228",
  "#AD1846",
  "#AD3618",
  "#AD1890",
  "#127AA3",
  "#1231A3",
  "#12A384",
]

const getStrongRandom = () =>
  window.crypto.getRandomValues(new Uint8Array(1))[0];

const COUNT = 30;
const matrixObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colors = new Array(COUNT)
  .fill(0)
  .map(() => niceColors[getStrongRandom() % 100][getStrongRandom() % 5]);

const getRandomFromRange = (min: number, max: number) =>
  Math.random() * (max - min) - Math.round((max - min) / 2);

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

  const boxes = useMemo(
    () =>
      colors.map(() => ({
        px: 0,
        py: 0,
        pz: 0,
        startAngle: getRandomFromRange(-Math.PI, Math.PI),
      })),
    []
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    colors.forEach((_, i) => {
      const indexFrom1 = i + 1;
      const min = -10 * indexFrom1;
      const max = 10 * indexFrom1;
      const currentBox = boxes[i];
      currentBox.px = getRandomFromRange(min, max) % 5;
      currentBox.py = getRandomFromRange(min, max) % 4;
      currentBox.pz = getRandomFromRange(min, max) % 5;
      matrixObject.position.set(currentBox.px, currentBox.py, currentBox.pz);
      matrixObject.rotation.y += getRandomFromRange(-Math.PI, Math.PI);
      matrixObject.updateMatrix();
      // @ts-ignore
      ref.current.setMatrixAt(i, matrixObject.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) {
      return;
    }
    const time = state.clock.getElapsedTime();
    colors.forEach((_, i) => {
      const currentBox = boxes[i];
      currentBox.py += Math.sin(currentBox.startAngle + time * 2) * 0.01;
      matrixObject.position.set(currentBox.px, currentBox.py, currentBox.pz);
      matrixObject.rotation.y = Math.sin(currentBox.startAngle + time / 4);
      matrixObject.updateMatrix();
      // @ts-ignore
      ref.current.setMatrixAt(i, matrixObject.matrix);
      // console.log(">>>>>> ", i, currentBox);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.rotation.y += delta / 2;
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
      value: 0.2,
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

          {/* <Vignette /> */}
        </EffectComposer>
      )}
    </>
  );
};

export const GodRays: React.FC = () => {
  const { color } = useControls("Background", {
    color: "#904101",
  });
  return (
    <Canvas
      className="root"
      linear
      camera={{
        fov: 75,
        far: 100,
        position: [0, 0, 8],
      }}
    >
      <color attach="background" args={[color]} />
      <ambientLight intensity={0.3} color="#fff" />
      {/* <pointLight intensity={2} position={[5, 5, 0]} color="#fff" /> */}
      <Rectangle />
      <Sun />
      <OrbitControls />
    </Canvas>
  );
};
