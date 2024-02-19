// Scene
const scene = new THREE.Scene();

// Orthographic Camera
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-aspectRatio * 2, aspectRatio * 2, 2, -2, 1, 1000);
camera.position.set(0, 0, 10); // Default position

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Example for the first mesh in red
const geometry1 = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.position.set(-1, 1, 0); // Adjust position to center in the 1st quadrant
scene.add(mesh1);

// Repeat for the other three meshes with their respective colors and positions


// Render Function
function render() {
    renderer.render(scene, camera);
}

render();
