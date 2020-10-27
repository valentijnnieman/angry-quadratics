import {
  Line as ThreeLine,
  LineBasicMaterial,
  BufferGeometry,
  Vector2,
  Vector3,
  Camera,
} from "three";
export const createLine = (from: Vector2, to: Vector2, camera: Camera) => {
  const material = new LineBasicMaterial({ color: 0x0000ff });

  const fromWorldPos = new Vector3(from.x, from.y, 0);
  const toWorldPos = new Vector3(to.x, to.y, 0).unproject(camera);

  const points = [fromWorldPos, toWorldPos];

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new ThreeLine(geometry, material);
  line.name = "Dragline";
  return line;
};
