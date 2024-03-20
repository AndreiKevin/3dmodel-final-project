import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

import mini1 from "./mini1.js";
import cube from "./cube.js";
import light from "./lights.js";
import sphere from "./sphere.js";

//cube();
//mini1();
//light();

class CustomControls {
    constructor(camera) {
        this.camera = camera;
        this.phi = 0; // vertical angle
        this.theta = 0; // horizontal angle
    }

    lookRight(angle) {
        // rotate horizontally
        this.theta -= angle;
        this.update();
    }

    lookUp(angle) {
        // rotate vertically
        this.phi -= angle;
        this.update();
    }

    update() {
        const radius = 10; // distance from the camera to the origin
        const x = radius * Math.sin(this.phi) * Math.cos(this.theta);
        const y = radius * Math.cos(this.phi);
        const z = radius * Math.sin(this.phi) * Math.sin(this.theta);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

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
const controls = new CustomControls(camera);
//const controls = new FirstPersonControls(camera, target); // Set the target as the second argument
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

// Request pointer lock
target.requestPointerLock = target.requestPointerLock || target.mozRequestPointerLock;
document.addEventListener('click', function() {
    target.requestPointerLock();
});

// Listen for lock event
document.addEventListener('pointerlockchange', lockChange, false);
document.addEventListener('mozpointerlockchange', lockChange, false);

function lockChange() {
    if (document.pointerLockElement === target || document.mozPointerLockElement === target) {
        // Pointer was just locked
        // Enable the mousemove listener
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

function updatePosition(e) {
    controls.lookRight(e.movementX * 0.002);
    controls.lookUp(e.movementY * 0.002);
}

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

	renderer.render(scene, camera);
	console.log(camera.position);
}
animate();

// Handle keyboard events for camera movement
