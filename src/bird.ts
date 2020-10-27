import { WireframeGeometry, LineSegments, SphereBufferGeometry } from "three";

export const createBird = () => {
  var geometry = new SphereBufferGeometry(1, 1, 1);

  var wireframe = new WireframeGeometry(geometry);

  var line = new LineSegments(wireframe);

  line.name = "Bird";

  return line;
};
