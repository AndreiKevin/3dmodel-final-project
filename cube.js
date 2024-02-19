import * as THREE from "three";

export default function cube() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		100
	);
	const renderer = new THREE.WebGLRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0xdb4045 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Set camera position
	camera.position.z = 5;

	// Add light source
	const light = new THREE.PointLight(0xffffff, 1);
	light.position.set(0, 0, 5);
	scene.add(light);

	function animate() {
		requestAnimationFrame(animate);
		cube.rotation.x += 0.01;
		cube.rotation.y -= 0.01; // negative angle is clockwise
		cube.rotation.z += 0.01;
		renderer.render(scene, camera);
	}
	animate();
}
