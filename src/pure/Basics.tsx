import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const addLight = () => {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  return light;
};

export const Basics: React.FC = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    function render(time: number) {
      time *= 0.001; // convert time to seconds

      cube.rotation.x = time;
      cube.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    //#region Constants
    const fov = 75;
    const width = rootRef.current?.clientWidth || 0;
    const height = rootRef.current?.clientHeight || 1;
    const aspect = width / height;
    const near = 0.2;
    const far = 5;

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    //#endregion Constants
    const renderer = new THREE.WebGLRenderer({
      canvas: rootRef.current,
      antialias: true,
    });
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2; // Move the camera a little far from origin

    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    scene.add(addLight());

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }, []);

  return <canvas ref={rootRef} className="root" />;
};
