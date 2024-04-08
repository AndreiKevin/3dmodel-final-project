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
camera.position.x = 5.97;
camera.position.y = -5.56;
camera.position.z = -23.76;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id = "3d-canvas"; // Set a unique id for the canvas
document.body.appendChild(renderer.domElement);

/* -----------------------------------------CAMERA CONTROLS-----------------------------------------*/

const target = document.getElementById("3d-canvas"); 
const controls = new CustomControls(camera);
controls.movementSpeed = 10;
controls.lookSpeed = 0.3;
controls.noFly = true;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.0;
controls.verticalMax = 2.0;
controls.lon = -150;
controls.lat = 120;

let cameraSpeed = 0.1; 

let keys = {
	up: false,
	down: false,
	left: false,
	right: false,
	space: false,
	shift: false,
};

// Add event listeners for pressing keys
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
        gltf.scene.traverse((object) => {
            if (object.name === 'moon' && object.isLight) {
              object.intensity = 0.5; 
            }
          });
        animate(); // Only start animation if both objects are found
    } else {
        console.error('Failed to find the moon mesh or light in the scene.');
    }
}, undefined, function (error) {
    console.error('An error happened during the loading of the model:', error);
});

/* -----------------------------------------RENDERING-----------------------------------------*/

let startTime = Date.now();
const cycleDuration = 60000;
const initialDelayDuration = 120000;
//const cycleDuration = 10000;

let originalMoonColor = new THREE.Color(0xE1E6FF); 
const sunColor = new THREE.Color(0xFFFF00); 
const nightColor = new THREE.Color(0x0a0a23); 
const dayColor = new THREE.Color(0x87ceeb); 

function animate() {
    let elapsedTime = Date.now() - startTime;
    if (elapsedTime > initialDelayDuration) {
        elapsedTime -= initialDelayDuration;
        let cycleProgress = (elapsedTime % cycleDuration) / cycleDuration;
        let isNight = cycleProgress < 0.5;

        if (isNight) {
            // Night cycle
            moonMesh.visible = true;
            // Change moonMesh emissive color to its original color for the moon representation
            moonMesh.material.emissive.set(originalMoonColor);
            
            // Calculate moon's y position for the night time
            let moonPathProgress = cycleProgress / 0.5; // Normalize progress to [0,1] for night time
            moonMesh.position.y = moonPathProgress * 1000 - 500;
            
            // Adjust scene background to transition from night to day
            let backgroundColor = new THREE.Color().lerpColors(dayColor, nightColor, moonPathProgress);
            scene.background = backgroundColor;
            
            // Adjust lighting for night
            moonLight.color.setHSL(0.13, 1, Math.max(0.2, 1 - 2 * moonPathProgress));
            moonLight.intensity = Math.max(1, 2 - 4 * moonPathProgress);
        } else {
            // Day cycle
            moonMesh.visible = true;
            // Change moonMesh emissive color to sun color for the sun representation
            moonMesh.material.emissive.set(sunColor);
            
            // Calculate sun's y position for the day time
            let dayProgress = (cycleProgress - 0.5) * 2; // Normalize progress to [0,1] for day time
            moonMesh.position.y = dayProgress * 1000 - 500;
            
            // Adjust scene background to transition from day to night
            let backgroundColor = new THREE.Color().lerpColors(nightColor, dayColor, dayProgress);
            scene.background = backgroundColor;
            
            // Adjust lighting for day
            moonLight.color.setHSL(0.13, 1, Math.min(1, 0.2 + dayProgress));
            moonLight.intensity = Math.min(2, 1 + dayProgress);
        }
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

    //console.log(`(${camera.position.x}, ${camera.position.y}, ${camera.position.z})`);

    renderer.render(scene, camera);
}

