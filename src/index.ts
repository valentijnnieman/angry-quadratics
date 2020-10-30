import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Vector3,
} from "three";

import { createBird } from "./bird";
import { createParabole } from "./parabole";
import { createLine } from "./line";
import { clamp, v2Dot, getRoots, getAOS } from "./util/math";
import { createAxis } from "./axis";

// padding comes from Bootstrap css container class => 15 px on each side.
const padding = 30;
// 1170 is the max width of a Bootstrap container
const width = clamp(window.innerWidth, 0, 1170) - padding;
const height = width;
// const height = clamp(window.innerHeight, 0, 658) - padding;

let a = -0.1;
let b = 0;
let c = 0;

const createEquationString = (a: number, b: number, c: number) => {
  return `${a.toFixed(2)}x^2 + ${b.toFixed(2)}x + ${c.toFixed(2)}`;
};

const equationString = createEquationString(a, b, c);
const equationNode = document.getElementById("equation");
equationNode.appendChild(document.createTextNode(equationString));

const quadratic = (x: number) => {
  return Math.pow(a * x, 2) + b * x + c;
};

const roots = getRoots(a, b, c);

const aos = getAOS(a, b);
const xValues = [roots[0], aos, roots[1]];

const yValues = [0, quadratic(aos), 0];

const scene = new Scene();

const orthoWidth = width / 20;
const orthoHeight = height / 20;
const camera = new OrthographicCamera(
  orthoWidth / -2,
  orthoWidth / 2,
  orthoHeight / 2,
  orthoHeight / -2,
  1,
  100
);
camera.position.set(0, 0, 10);

const renderer = new WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor("white");
const target = document.getElementById("render-target");
target.appendChild(renderer.domElement);

const raycaster = new Raycaster();

const mouse = new Vector2();
const startDragging = new Vector2();

let hovering = false;
let mouseDown = false;
let dragging = false;
let released = false;
let releaseAnimationIndex = 0;

const onMouseMove = (event) => {
  // Set mouse params
  event.preventDefault();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

  if (mouseDown) {
    dragging = true;
    const baseVector = new Vector2(-1, 0);
    const constrained = new Vector2(
      clamp(mouse.x, -0.2, 0),
      clamp(mouse.y, -0.2, 0)
    );
    const magnitudeMouse = Math.sqrt(
      Math.pow(constrained.x, 2) + Math.pow(constrained.y, 2)
    );
    const dotProduct = v2Dot(baseVector, constrained);

    const theta = Math.cos(dotProduct / magnitudeMouse);
    const angle = Math.acos(theta);

    if (theta) {
      a = -theta + magnitudeMouse * 2.5;
      b = 2.0 - angle * 2;
      c = theta + magnitudeMouse * 25;
    }
  }
};
const onMouseDown = (event) => {
  if (hovering) {
    mouseDown = true;
    startDragging.x = bird.position.x;
    startDragging.y = bird.position.y;
  }
};
const onMouseUp = (event) => {
  mouseDown = false;
  if (dragging) {
    dragging = false;
    released = true;
    scene.remove(dragLine);
  }
};
const onTouch = (event) => {
  if (event.touches.length > 1) {
    // Ignore multi touch events
    return;
  }
  const touch = event.changedTouches[0];
  let mouseEventType;
  if (event.type === "touchmove") {
    mouseEventType = "mousemove";
  } else if (event.type === "touchstart") {
    mouseEventType = "mousedown";
  } else if (event.type === "touchend") {
    mouseEventType = "mouseup";
  }

  const mouseEvent = new MouseEvent(mouseEventType, {
    view: event.target.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true,
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  touch.target.dispatchEvent(mouseEvent);
};
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);

renderer.domElement.addEventListener("touchmove", onTouch, false);
renderer.domElement.addEventListener("touchstart", onTouch, false);
renderer.domElement.addEventListener("touchend", onTouch, false);

let bird = createBird();
scene.add(bird);

let parabole = createParabole(startDragging, xValues, yValues);
let dragLine = createLine(startDragging, mouse, camera);
scene.add(dragLine);

const xAxis = createAxis(new Vector2(-40, 0), new Vector2(40, 0));
const yAxis = createAxis(new Vector2(0, -40), new Vector2(0, 40));

xAxis.forEach((obj) => {
  scene.add(obj);
});
yAxis.forEach((obj) => {
  scene.add(obj);
});

const animate = function () {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  const birdInScene = scene.children.find((child) => child.name === "Bird");

  if (birdInScene) {
    // @ts-ignore - there's a type error here, seems it's a bug in three js typing
    birdInScene.material.color.set(0x00ff00);
  }

  const hoveringBird = intersects.find(
    (intersect) => intersect.object.name === "Bird"
  );
  if (hoveringBird) {
    hovering = true;
    // @ts-ignore - there's a type error here, seems it's a bug in three js typing
    hoveringBird.object.material.color.set(0xff0000);
  } else {
    hovering = false;
  }

  if (dragging) {
    // update dragline
    scene.remove(dragLine);
    dragLine = createLine(
      startDragging,
      new Vector2(clamp(mouse.x, -0.2, 0), clamp(mouse.y, -0.2, 0)),
      camera
    );
    scene.add(dragLine);

    // update parabole
    scene.remove(parabole);
    const roots = getRoots(a, b, c);

    const aos = getAOS(a, b);
    const xValues = [roots[0], aos, roots[1]];

    const yValues = [0, quadratic(aos), 0];
    parabole = createParabole(startDragging, xValues, yValues);
    scene.add(parabole);

    // update equation strings
    equationNode.innerHTML = createEquationString(a, b, c);
  }

  if (released) {
    // animate bird's flight :-)
    const position = parabole.geometry.getAttribute("position");
    const points = position.array;
    if (
      releaseAnimationIndex < points.length &&
      releaseAnimationIndex + 1 < points.length &&
      releaseAnimationIndex + 2 < points.length
    ) {
      const newPos = new Vector3(
        points[releaseAnimationIndex],
        points[releaseAnimationIndex + 1],
        points[releaseAnimationIndex + 2]
      );
      bird.position.x = newPos.x;
      bird.position.y = newPos.y;
      releaseAnimationIndex += 3;
    } else {
      releaseAnimationIndex = 0;
      released = false;
      // change name of old bird object
      bird.name = "OldBird";
      bird = createBird();
      scene.add(bird);
    }
  }

  bird.rotation.y += 0.01;
  renderer.render(scene, camera);
};

animate();
