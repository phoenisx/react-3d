import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import create from "zustand";

interface StoreState {
  renderer: THREE.Renderer | null;
}

const INITIAL_STATE: StoreState = {
  renderer: null,
};

type Store = {
  state: StoreState;
  updateState: (
    key: keyof typeof INITIAL_STATE,
    value: ValueOf<typeof INITIAL_STATE>
  ) => void;
};

const useStore = create<Store>(set => ({
  state: INITIAL_STATE,
  updateState: (key, value) => {
    set(partial => {
      partial.state[key] = value;
    });
  },
}));

const addLight = (x: number, y: number, z: number) => {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(x, y, z);
  return light;
};

const createBox = () => {
  const width = 5.8;
  const height = 8;
  const depth = 8;
  return new THREE.BoxGeometry(width, height, depth);
};

// Following is 2D Geometry, for 3D use DodecahedronGeometry
const createCircle = () => {
  const radius = 7;
  const segments = 20;
  return new THREE.CircleGeometry(radius, segments);
};

const createDodecahedron = () => {
  const radius = 7;
  const detail = 2;
  return new THREE.DodecahedronGeometry(radius, detail);
};

const spread = 15;

const getPosition = (x: number, y: number) => {
  return [x * spread, y * spread];
};

function createMaterial() {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });

  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  material.color.setHSL(hue, saturation, luminance);

  return material;
}

export const Primitives: React.FC = () => {
  const rootRef = useRef<HTMLCanvasElement>(null);
  const updateStore = useStore(store => store.updateState);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    //#region Constants
    const fov = 40;
    const width = rootRef.current?.clientWidth || 0;
    const height = rootRef.current?.clientHeight || 1;
    const aspect = width / height;
    const near = 0.1;
    const far = 1000;
    //#endregion Constants
    const renderer = new THREE.WebGLRenderer({
      canvas: rootRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    updateStore("renderer", renderer);
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 120; // Move the camera a little far from origin

    const scene = new THREE.Scene();
    scene.add(addLight(-1, 2, 4));
    scene.add(addLight(1, -2, -4));
    const objects: THREE.Mesh[] = [];
    const points: THREE.Points[] = [];

    {
      const mesh = new THREE.Mesh(createBox(), createMaterial());
      const [x, y] = getPosition(-2, 2);
      mesh.position.x = x;
      mesh.position.y = y;
      scene.add(mesh);
      objects.push(mesh);
    }
    {
      const mesh = new THREE.Mesh(createCircle(), createMaterial());
      const [x, y] = getPosition(-1, 2);
      mesh.position.x = x;
      mesh.position.y = y;
      scene.add(mesh);
      objects.push(mesh);
    }
    {
      const mesh = new THREE.Mesh(createDodecahedron(), createMaterial());
      const [x, y] = getPosition(0, 2);
      mesh.position.x = x;
      mesh.position.y = y;
      scene.add(mesh);
      objects.push(mesh);
    }
    {
      const radius = 7;
      const widthSegments = 12;
      const heightSegments = 8;
      const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments
      );
      const material = new THREE.PointsMaterial({
        color: "red",
        sizeAttenuation: false,
        size: 3, // in world units
      });
      const mesh = new THREE.Points(geometry, material);
      const [x, y] = getPosition(1.5, 2);
      mesh.position.x = x;
      mesh.position.y = y;
      scene.add(mesh);
      points.push(mesh);
    }

    function render(time: number) {
      time *= 0.001; // convert time to seconds

      objects.forEach(mesh => {
        mesh.rotation.x = time;
        mesh.rotation.y = time;
      });
      points.forEach(mesh => {
        mesh.rotation.x = time;
        mesh.rotation.y = time;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return <canvas ref={rootRef} className="root" />;
};
