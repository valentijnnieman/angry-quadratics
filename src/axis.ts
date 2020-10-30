import {
  Line,
  LineBasicMaterial,
  BufferGeometry,
  Vector2,
  Vector3,
  Camera,
} from "three";
export const createAxis = (from: Vector2, to: Vector2) => {
  const material = new LineBasicMaterial({ color: "lightgrey" });

  const fromWorldPos = new Vector3(from.x, from.y, 0);
  const toWorldPos = new Vector3(to.x, to.y, 0);

  const points = [fromWorldPos, toWorldPos];

  const nubLines = [];
  if (from.x !== 0) {
    for (let i = from.x; i < to.x; i++) {
      const nub = [new Vector3(i, 0.25, 0), new Vector3(i, -0.25, 0)];
      const nubGeometry = new BufferGeometry().setFromPoints(nub);
      nubLines.push(new Line(nubGeometry, material));
    }
  } else if (from.y !== 0) {
    for (let i = from.y; i < to.y; i++) {
      const nub = [new Vector3(0.25, i, 0), new Vector3(-0.25, i, 0)];
      const nubGeometry = new BufferGeometry().setFromPoints(nub);
      nubLines.push(new Line(nubGeometry, material));
    }
  }

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  line.name = "Dragline";
  return [line, ...nubLines];
};
