import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Canvas
const canvas = document.querySelector("canvas.scene");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let animationMixer = null;

gltfLoader.load("/models/low_poly_city.glb", (glb) => {
    glb.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(glb.scene);

    // Play animation for each object in glb
    animationMixer = new THREE.AnimationMixer(glb.scene);
    glb.animations.forEach((animation) => {
        const action = animationMixer.clipAction(animation);
        action.play();
    });
});

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);

scene.add(directionalLight);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.set(-0.06, 1.7, 3.8);
scene.add(camera);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Play each frame
const clock = new THREE.Clock();
let previousTime = 0;

const render = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (animationMixer) {
        animationMixer.update(deltaTime * 0.5);
    }

    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
};

render();
