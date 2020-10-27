import { Vector2 } from "three";

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const v2Dot = (a: Vector2, b: Vector2) => {
  return a.x * b.x + a.y * b.y;
};

export const getAOS = (a: number, b: number) => {
  return -b / (2 * a);
};

export const getRoots = (a: number, b: number, c: number) => {
  if (a === 0) {
    return null;
  }
  const discriminant = Math.pow(b, 2) - 4 * a * c;
  const first = (-b + Math.sqrt(discriminant)) / (2 * a);
  const second = (-b - Math.sqrt(discriminant)) / (2 * a);
  return [first, second];
};
