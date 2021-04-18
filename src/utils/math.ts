import { Vector3 } from "@react-three/fiber";

export const dot = (prop1: Vector3, prop2: Vector3): Vector3 => {
  if (Array.isArray(prop1) && Array.isArray(prop2)) {
    return prop1.map(
      (item: number, index: number) => item * prop2[index]
    ) as Vector3;
  } else if (!Array.isArray(prop1) && Array.isArray(prop2)) {
    return prop2.map((item: number) => item * (prop1 as number)) as Vector3;
  } else if (Array.isArray(prop1) && !Array.isArray(prop2)) {
    return prop1.map((item: number) => item * (prop2 as number)) as Vector3;
  } else {
    return (prop1 as number) * (prop2 as number);
  }
};

export const add = (prop1: Vector3, prop2: Vector3): Vector3 => {
  if (Array.isArray(prop1) && Array.isArray(prop2)) {
    return prop1.map(
      (item: number, index: number) => item + prop2[index]
    ) as Vector3;
  } else if (!Array.isArray(prop1) && Array.isArray(prop2)) {
    return prop2.map((item: number) => item + (prop1 as number)) as Vector3;
  } else if (Array.isArray(prop1) && !Array.isArray(prop2)) {
    return prop1.map((item: number) => item + (prop2 as number)) as Vector3;
  } else {
    return (prop1 as number) + (prop2 as number);
  }
};
