// Mini-Program #2 (Exercise): Edit the following code to
// 1. modify the point light source for it to be a RED color light source
// 2. add two more light sources, one should be GREEN, and the other BLUE in color
// 3. add also two more corresponding light helpers
// 4. set the 3 light positions such that they are in different locations

import * as THREE from "three";

export default function CHUA_LIGHTS() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //-----  GEOMETRY -----
  const geometry = new THREE.SphereGeometry(2, 64, 64);

  //----- MATERIAL if there is NO LIGHTING -----
  // If there is no lighting use MeshBasicMaterial
  //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

  //----- MATERIAL if there is LIGHTING -----
  //
  // Diffuse + Specular material property: use MeshPhongMaterial()
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xff0000,
    shininess: 75,
    flatShading: true,
  });
  //    k_d is the diffuse material coefficient constant
  //    k_s is the specular material coefficient constant
  //    In threejs k_d corresponds to the color parameter (0 to 255 or 0 to 0xff)
  //    In threejs k_s corresponds to the specular parameter (0 to 255 or 0 to 0xff)
  //    In the setting above: k_s,r is 0xff, k_s,g is 0x00 and k_s,b is 0x00
  //              this means: k_s,r reflects red 100%
  //                          k_s,g reflects green 0%
  //                          k_s,b reflects blue 0%
  //              thus the specular highlight will be reddish in color
  //    alpha is the shininess factor
  //    In threejs alpha corresponds to shininess parameter (0 to 100); the default value is 30

  //---- MESH -----
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  //----- LIGHT(S) -----
  // Incorporate a point light via PointLight().
  // A point light is in a finite location in 3D space.
  // 1. Modify the point light source to be a RED color light source
  const redLight = new THREE.PointLight(0xff0000, 5, 100);
  redLight.position.set(5, 5, 5); // Set different positions for each light
  scene.add(redLight);

  // Adding red light helper
  const redLightHelper = new THREE.PointLightHelper(redLight, 0.5);
  scene.add(redLightHelper);

  // 2. Add a GREEN light source
  const greenLight = new THREE.PointLight(0x00ff00, 5, 100);
  greenLight.position.set(-5, 5, 5);
  scene.add(greenLight);

  // Adding green light helper
  const greenLightHelper = new THREE.PointLightHelper(greenLight, 0.5);
  scene.add(greenLightHelper);

  // 3. Add a BLUE light source
  const blueLight = new THREE.PointLight(0x0000ff, 5, 100);
  blueLight.position.set(0, -5, 5); 
  scene.add(blueLight);

  // Adding blue light helper
  const blueLightHelper = new THREE.PointLightHelper(blueLight, 0.5);
  scene.add(blueLightHelper);

  //----- CAMERA -----
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 15;

  //----- ACTION! -----
  renderer.render(scene, camera); 
  // just render one frame, no animation
}

CHUA_LIGHTS();