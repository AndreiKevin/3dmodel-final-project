import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import mini1 from "./mini1.js";
import cube from "./cube.js";
import light from "./lights.js";
import sphere from "./sphere.js";

//cube();
//mini1();
//light();

/* -----------------------------------------SCENE, CAMERA, RENDERER-----------------------------------------*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "3d-canvas"; // Set a unique id for the canvas
document.body.appendChild(renderer.domElement);

/* -----------------------------------------CAMERA CONTROLS-----------------------------------------*/

const target = document.getElementById("3d-canvas"); // Get the canvas element
const controls = new FirstPersonControls(camera, target); // Set the target as the second argument
controls.lookSpeed = 0.4;
controls.movementSpeed = 20;
controls.noFly = true;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.lon = -150;
controls.lat = 120;

controls.movementSpeed = 10;
controls.lookSpeed = 0.1;

/* -----------------------------------------MATERIALS-----------------------------------------*/

sphere(scene);

camera.position.z = 15;

/* -----------------------------------------RENDERING-----------------------------------------*/

let clock = new THREE.Clock();
// Render loop
function animate() {
	requestAnimationFrame(animate);
	controls.update(clock.getDelta()); // Update camera controls
	renderer.render(scene, camera);
	console.log(camera.position);
}
animate();


// Handle keyboard events for camera movement

