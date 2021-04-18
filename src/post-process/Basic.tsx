import { Box } from "@react-three/drei";
import { Canvas, extend, Node, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useRef } from "react";
import { Mesh } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";

extend({ EffectComposer, RenderPass, BloomPass, FilmPass });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      bloomPass: Node<BloomPass, typeof BloomPass>;
      filmPass: Node<FilmPass, typeof FilmPass>;
    }
  }
}

const Rectangle = () => {
  const ref = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y += delta;
    ref.current.rotation.x += delta;
  });

  return (
    <Box ref={ref} args={[1, 1, 1]}>
      <meshPhongMaterial color="#f3cc66" />
    </Box>
  );
};

const Effects: React.FC = () => {
  const composer = useRef<EffectComposer>(null);
  const { scene, camera, size, gl } = useThree();
  // const effects = useControls("BloomPass", {
  //   enable: true,
  //   strength: { value: 1, step: 1 },
  //   kernelSize: { value: 25, step: 1 },
  //   sigma: { value: 4, step: 1 },
  //   resolution: { value: 256, step: 1 },
  // });
  const film = useControls("FilmPass", {
    enable: true,
    noiseIntensity: { value: 0.35, min: 0, max: 1, step: 0.01 },
    scanlinesIntensity: { value: 0.025, min: 0, max: 1, step: 0.001 },
    scanlinesCount: { value: 648, step: 1 },
  });

  useEffect(() => composer.current?.setSize(size.width, size.height), [size]);
  useFrame(() => composer.current?.render(), 2);

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {/* {effects.enable && (
        <bloomPass
          attachArray="passes"
          args={[
            effects.strength,
            effects.kernelSize,
            effects.sigma,
            effects.resolution,
          ]}
          renderToScreen
        />
      )} */}
      {film.enable && (
        <filmPass
          attachArray="passes"
          args={[
            film.noiseIntensity,
            film.scanlinesIntensity,
            film.scanlinesCount,
            0,
          ]}
          renderToScreen
        />
      )}
    </effectComposer>
  );
};

export const Basic: React.FC = () => {
  return (
    <Canvas
      className="root"
      camera={{
        fov: 75,
        far: 5,
        position: [0, 0, 2],
      }}
    >
      <ambientLight intensity={0.3} color="#fff" />
      <pointLight intensity={2} position={[5, 5, 0]} color="#fff" />
      <Rectangle />
      <Effects />
    </Canvas>
  );
};
