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
controls.movementSpeed = 10;
controls.lookSpeed = 0.3;
controls.noFly = true;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.lon = -150;
controls.lat = 120;

let cameraSpeed = 0.1; // Adjust speed as needed

// Create key state object
let keys = {
	up: false,
	down: false,
	left: false,
	right: false,
	space: false,
	shift: false,
};

// Add event listeners for keydown
window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowUp":
		case "w":
			keys.up = true;
			break;
		case "ArrowDown":
		case "s":
			keys.down = true;
			break;
		case "ArrowLeft":
		case "a":
			keys.left = true;
			break;
		case "ArrowRight":
		case "d":
			keys.right = true;
			break;
		case " ":
			keys.space = true;
			break;
		case "Shift":
			keys.shift = true;
			break;
	}
});

// Add event listeners for keyup
window.addEventListener("keyup", (e) => {
	switch (e.key) {
		case "ArrowUp":
		case "w":
			keys.up = false;
			break;
		case "ArrowDown":
		case "s":
			keys.down = false;
			break;
		case "ArrowLeft":
		case "a":
			keys.left = false;
			break;
		case "ArrowRight":
		case "d":
			keys.right = false;
			break;
		case " ":
			keys.space = false;
			break;
		case "Shift":
			keys.shift = false;
			break;
	}
});

/* -----------------------------------------MATERIALS-----------------------------------------*/

sphere(scene);

camera.position.z = 15;

/* -----------------------------------------RENDERING-----------------------------------------*/

let clock = new THREE.Clock();
// Render loop
function animate() {
	requestAnimationFrame(animate);
	if (keys.up) camera.position.z -= cameraSpeed;
	if (keys.down) camera.position.z += cameraSpeed;
	if (keys.left) camera.position.x -= cameraSpeed;
	if (keys.right) camera.position.x += cameraSpeed;
    if (keys.space) camera.position.y += cameraSpeed;
    if (keys.shift) camera.position.y -= cameraSpeed;
	controls.update(clock.getDelta()); // Update camera controls
	renderer.render(scene, camera);
	console.log(camera.position);
}
animate();

// Handle keyboard events for camera movement
