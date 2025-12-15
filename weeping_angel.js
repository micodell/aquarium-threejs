import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Setup Scene
const scene = new THREE.Scene();
// Set a background color so you know the scene is rendering even if the model is dark
scene.background = new THREE.Color(0x111111); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- SETUP CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; // Adds inertia (smooth slowing down)
controls.dampingFactor = 0.05;
controls.enablePan = false;    // Disable right-click dragging (keeps camera centered)

// Limit how far they can zoom in/out (optional)
controls.minDistance = 1;
controls.maxDistance = 25;

// 1. Define the Target (Where the camera looks)
const target = new THREE.Vector3(-30, 4, 6);
controls.target.copy(target);

// 2. Calculate Camera Position for 90-degree start
// We position the camera relative to the target
const distance = 15; // How far away from the target
const angle = Math.PI; // 90 degrees in Radians

// Math to place camera in a circle around the target
camera.position.x = target.x + (distance * Math.sin(angle));
camera.position.y = target.y; // Keep same height as target
camera.position.z = target.z + (distance * Math.cos(angle));

// 3. Apply changes
controls.update();
// --------------------------------

// --- CRITICAL FIX: ADD LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const centerLight = new THREE.PointLight(0xff0000, 1, 10); // Red light, intensity 1, range 10m
centerLight.position.set(0, 2, 0); // Hanging 2 meters in the air
scene.add(centerLight);
// --------------------------------

// 2. Load GLBs
const corridorLoader = new GLTFLoader();
corridorLoader.load('models/horror_corridor_1.glb', (gltf) => {
    const corridor = gltf.scene;
    corridor.position.set(0, 0, 0); 

    // ADJUSTMENT 2: Scale
    // Corridors can be huge. If it looks too big, try 0.5. If too small, try 10.
    // Start with 1.0 (original size) and adjust.
    corridor.scale.set(1, 1, 1); 

    scene.add(corridor);

}, undefined, (error) => {
    console.error('Error loading corridor:', error);
});

const angelLoader = new GLTFLoader();
angelLoader.load('models/weeping_angel.glb', (gltf) => {
    const angel = gltf.scene;
    angel.scale.set(1.5, 1.5, 1.5); 
    angel.position.set(-8, 2.5, 0.5);
    angel.rotation.y = 180 * (Math.PI / 180);
    scene.add(angel);

    // 1. Create a box around the angel
    const box = new THREE.Box3().setFromObject(angel);

    // 2. The box.max.z is the "front face" of the model
    // We add +0.8 to give it some breathing room (The Safety Margin)
    const safeStoppingPoint = box.max.z + 0.8; 
    console.log("Stopping at Z:", safeStoppingPoint); // Check console to see the number!

    startCinematicSequence(safeStoppingPoint);
}, undefined, (error) => {
    console.error('An error occurred loading the model:', error);
});

camera.position.set(-4, 4, 0);

// 3. The GSAP Logic
function startCinematicSequence(targetZ) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // tl.to(camera.position, {
    //     z: -targetZ,
    //     duration: 10,
    //     ease: "power1.inOut"
    // });

    // tl.to(camera.rotation, {
    //     x: -45 * (Math.PI / 180),
    //     // y: 30 * (Math.PI / 180),
    //     // z: -30 * (Math.PI / 180),
    //     duration: 10,
    //     ease: "power3.inOut"
    // }, "<");

    // tl.to(camera.rotation, {
    //     y: 30 * (Math.PI / 180),
    //     // z: -30 * (Math.PI / 180),
    //     duration: 10,
    //     ease: "power1.inOut"
    // }, "<");
    // tl.to(camera.rotation, {
    //     y: -60 * (Math.PI / 180),
    //     duration: 10,
    //     ease: "power3.inOut"
    // }, "<");
}

// --- KEYBOARD CONTROLS SETUP ---
const keyState = {};
const moveSpeed = 0.05; // Walk speed
const turnSpeed = 0.01; // Look speed (how fast you turn)

window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

function updateMovement() {
    // ---------------------------------------------------------
    // 1. MOVEMENT (WASD) - Moves Camera & Target together
    // ---------------------------------------------------------
    
    // Get direction camera is facing (ignoring Y for floor movement)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize();

    // Get "Right" vector
    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const moveVector = new THREE.Vector3(0, 0, 0);

    // Only map W, A, S, D to movement now
    if (keyState['KeyW']) moveVector.addScaledVector(forward, moveSpeed);
    if (keyState['KeyS']) moveVector.addScaledVector(forward, -moveSpeed);
    if (keyState['KeyA']) moveVector.addScaledVector(right, -moveSpeed);
    if (keyState['KeyD']) moveVector.addScaledVector(right, moveSpeed);

    // Apply movement
    camera.position.add(moveVector);
    controls.target.add(moveVector);

    // ---------------------------------------------------------
    // 2. ROTATION (Arrow Keys) - Rotates Target around Camera
    // ---------------------------------------------------------
    
    if (keyState['ArrowLeft'] || keyState['ArrowRight']) {
        // 1. Get the vector from Camera to Target
        const offset = new THREE.Vector3().subVectors(controls.target, camera.position);
        
        // 2. Determine direction (+ for Left, - for Right)
        const direction = keyState['ArrowLeft'] ? 1 : -1;
        
        // 3. Rotate that vector around the Y axis (UP)
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnSpeed * direction);

        // 4. Update the Target position
        controls.target.copy(camera.position).add(offset);
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    controls.update();
    renderer.render(scene, camera);
}
animate();