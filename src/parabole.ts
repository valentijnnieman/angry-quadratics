import {
  QuadraticBezierCurve,
  Line,
  BufferGeometry,
  Vector2,
  LineDashedMaterial,
} from "three";
export const createParabole = (
  startPosition: Vector2,
  xValues: Array<number>,
  yValues: Array<number>
) => {
  // const material = new LineBasicMaterial({ color: 0x0000ff });
  const material = new LineDashedMaterial({
    color: "magenta",
    linewidth: 4,
    scale: 4,
    dashSize: 8,
    gapSize: 4,
  });

  const curve = new QuadraticBezierCurve(
    new Vector2(startPosition.x, yValues[0]),
    new Vector2(Math.abs(xValues[0]) + xValues[1], yValues[1]),
    new Vector2(Math.abs(xValues[0]) + xValues[2], yValues[2])
  );

  const points = curve.getPoints(50);

  const geometry = new BufferGeometry().setFromPoints(points);
  const line = new Line(geometry, material);
  return line;
};
