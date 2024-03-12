import * as THREE from 'three';

export default function mini1() {
    // basic initializations
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 1, 1000);
    
    // helpers
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);
    axesHelper.position.set(0, 0, -5);

    // objects
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set(1, 1, -5); 
    scene.add(cubeMesh);

    const torusGeometry = new THREE.TorusGeometry(0.45, 0.1);
    const torusMaterial = new THREE.MeshBasicMaterial({color: 0xffe24f});
    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    torusMesh.position.set(-1, 1, -5); 
    scene.add(torusMesh);

    const sphereGeometry = new THREE.SphereGeometry(0.6);
    const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.set(1, -1, -5);
    scene.add(sphereMesh);

    const octahedronGeometry = new THREE.OctahedronGeometry(0.6, 1);
    const octahedronMaterial = new THREE.MeshBasicMaterial({color: 0x1c31ed});
    const octahedronMesh = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedronMesh.position.set(-1, -1, -5);
    scene.add(octahedronMesh);

    // rendering
    renderer.render(scene, camera);
}
