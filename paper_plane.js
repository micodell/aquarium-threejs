import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from 'gsap';

// --- 1. SETUP SCENE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.FogExp2(0x111111, 0.05); // Fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// --- 2. THE RIG (Vehicle Group) ---
// This group holds both the Camera and the Paper Plane
const vehicleGroup = new THREE.Group();
scene.add(vehicleGroup);

// Set initial position (Starting further back)
vehicleGroup.position.set(0, 1.6, 8); 

// --- CAMERA SETUP WITHIN RIG ---
// Position camera behind and slightly above the center of the vehicleGroup
camera.position.set(0, 0.5, 2); 
camera.lookAt(0, 0, -5); // Look forward relative to the rig
vehicleGroup.add(camera);

// --- 3. PAPER PLANE MODEL ---
const planeLoader = new GLTFLoader();
planeLoader.load('models/paper_plane.glb', (gltf) => {
    const paperPlane = gltf.scene;
    paperPlane.scale.set(0.01, 0.01, 0.01);
    paperPlane.position.y = -0.3;
    paperPlane.rotation.y = 90 * (Math.PI / 180); 
    vehicleGroup.add(paperPlane);
});



// --- 4. LOAD THE WEEPING ANGEL (Target) ---
const loader = new GLTFLoader();
loader.load('models/weeping_angel.glb', (gltf) => {
    const angel = gltf.scene;
    angel.traverse((node) => { if(node.isMesh) node.castShadow = true; });
    scene.add(angel);

    // --- CALCULATE STOPPING POINT (From try1.js) ---
    const box = new THREE.Box3().setFromObject(angel);
    // box.max.z is the "front face". Add margin.
    // Note: Since we are in a rig, the rig center stops here. 
    // The camera is +2z behind the rig center. 
    // So we might want to get closer. Let's adjust margin.
    const safeStoppingPoint = box.max.z + 1.5; 

    console.log("Calculated Stopping Z:", safeStoppingPoint);
    
    // Start the flight
    startCinematicSequence(safeStoppingPoint);

}, undefined, (error) => {
    console.error('Error loading angel:', error);
    document.getElementById('loading').innerText = "Error loading model (Check console)";
});


// --- 5. GSAP ANIMATION LOGIC ---
function startCinematicSequence(targetZ) {
    // We animate the vehicleGroup, not just the camera
    const tl = gsap.timeline({ 
        repeat: -1, 
        yoyo: false, 
        defaults: { ease: "power2.inOut" } 
    });

    const duration = 8; // Slower flight for drama

    // 1. Move Forward (Flight Path)
    tl.to(vehicleGroup.position, {
        z: targetZ,
        duration: duration,
        ease: "power1.inOut"
    }, "fly");

    // 2. Camera Motion Requests (Applied to Vehicle Group)
    // "roll ccw from 0 to 45 degree ccw" -> Z rotation
    // "yaw to right about 35 degree" -> Y rotation (Negative is right usually)
    // "pitch up about 25 degree" -> X rotation
    
    // Convert degrees to radians
    const rad = (deg) => deg * (Math.PI / 180);

    tl.to(vehicleGroup.rotation, {
        z: rad(45),   // Roll CCW
        y: rad(-35),  // Yaw Right
        x: rad(25),   // Pitch Up
        duration: duration
    }, "fly");
}


// --- 6. RENDER LOOP ---
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();