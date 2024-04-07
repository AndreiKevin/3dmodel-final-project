import * as THREE from "three";
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class CustomControls {
    constructor(camera) {
        this.camera = camera;
        this.yaw = 0;
        this.pitch = 0;
    }

    lookRight(angle) {
        this.yaw -= angle;
        this.update();
    }

    lookUp(angle) {
        this.pitch -= angle;
        this.update();
    }

    update() {
        // Clamp the pitch
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

        const quaternionY = new THREE.Quaternion();
        const quaternionX = new THREE.Quaternion();

        // Rotate around world Y axis
        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        // Rotate around local X axis
        quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);

        const finalQuaternion = new THREE.Quaternion().multiplyQuaternions(quaternionY, quaternionX);
        this.camera.quaternion.copy(finalQuaternion);
    }
}



/* -----------------------------------------SCENE, CAMERA, RENDERER-----------------------------------------*/

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc0a14);
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = -5.31672;
camera.position.y = 21.7672;
camera.position.x = 6.43933;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "3d-canvas"; // Set a unique id for the canvas
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;
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

function findObjectByName(obj, name) {
    if (obj.name === name) {
        return obj;
    }
    for (let child of obj.children) {
        let result = findObjectByName(child, name);
        if (result) {
            return result;
        }
    }
    return null;
}

let moonMesh, moonLight; 

const gltfLoader = new GLTFLoader();

gltfLoader.load('scene.gltf', function (gltf) {
    scene.add(gltf.scene);
    moonMesh = findObjectByName(gltf.scene, "Sphere006");
    moonLight = scene.getObjectByName("moon"); 
    if (moonMesh && moonLight) {
        animate(); // Only start animation if both objects are found
    } else {
        console.error('Failed to find the moon mesh or light in the scene.');
    }
}, undefined, function (error) {
    console.error('An error happened during the loading of the model:', error);
});



/* -----------------------------------------LIGHTS-----------------------------------------*/

// const exrLoader = new EXRLoader();
// exrLoader.load(
//     '/textures/NightEnvironmentHDRI007_4K-HDR.exr',
//     function (texture) {
//       texture.mapping = THREE.EquirectangularReflectionMapping;
//       scene.environment = texture;
//     },
//     undefined, // Progress callback (optional)
//     function (error) {
//       console.error('An error happened loading the EXR file:', error);
//     }
//   );

/* -----------------------------------------RENDERING-----------------------------------------*/

let startTime = Date.now();
const cycleDuration = 600000; // 10 minutes in milliseconds (5 minutes for night + 5 minutes for day)
//const cycleDuration = 100000;

function animate() {
    let elapsedTime = Date.now() - startTime;
  let cycleProgress = (elapsedTime % cycleDuration) / cycleDuration;
  let isNight = cycleProgress < 0.5;

  if (isNight) {
    moonMesh.visible = true; // Make the moon visible during night
    // Move the moon based on cycleProgress, this is a simplified linear movement
    let moonPathProgress = cycleProgress / 0.5; // Normalize progress to [0,1] for night time
    moonMesh.position.x = moonPathProgress * 10 - 5; // Example movement from -5 to 5 on x-axis
    moonLight.color.setHSL(0.13, 1, Math.max(0.2, 1 - 2 * moonPathProgress)); // Change color to yellowish as it approaches day
    moonLight.intensity = Math.max(1, 2 - 4 * moonPathProgress); // Decrease intensity as it approaches day
  } else {
    // During day, keep the moon outside of the scene or make it invisible
    moonMesh.visible = false;
    // Reset moon's position for the next night
    if (moonMesh.position.x !== -5) moonMesh.position.x = -5;

    // Change light to be yellow and more intense as it becomes daytime
    let dayProgress = (cycleProgress - 0.5) * 2; // Normalize progress to [0,1] for day time
    moonLight.color.setHSL(0.13, 1, Math.min(1, 0.2 + dayProgress)); // Change color to more yellow as day progresses
    moonLight.intensity = Math.min(2, 1 + dayProgress); // Increase intensity during day
  }

    requestAnimationFrame(animate);

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    const speed = cameraSpeed;
    if (keys.up) { // W - move forward
        camera.position.addScaledVector(direction, speed);
    }
    if (keys.down) { // S - move backward
        camera.position.addScaledVector(direction, -speed);
    }
    if (keys.left) { // A - move left
        camera.position.addScaledVector(right, speed);
    }
    if (keys.right) { // D - move right
        camera.position.addScaledVector(right, -speed);
    }
    if (keys.space) { // Space - move up
        camera.position.y += speed;
    }
    if (keys.shift) { // Shift - move down
        camera.position.y -= speed;
    }

    renderer.render(scene, camera);
}

