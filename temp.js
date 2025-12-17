import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from 'gsap';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// 1. Setup Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x001e0f); // Dark greenish/blue water color

const clock = new THREE.Clock();
let mixer;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// --- RENDERER SETTINGS ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace; 
document.body.appendChild(renderer.domElement);

// --- ENVIRONMENT ---
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2); 
dirLight.position.set(5, 10, 5); 
dirLight.castShadow = true; 
dirLight.shadow.mapSize.width = 2048; 
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Point light to make the inside of the aquarium glow
const waterLight = new THREE.PointLight(0x00ffff, 2, 20); 
waterLight.position.set(0, 5, 0); 
scene.add(waterLight);

// 2. Load GLB
const aquariumLoader = new GLTFLoader();
aquariumLoader.load('models/room_aquarium_now_animated.glb', (gltf) => {
    const aquarium = gltf.scene;
    aquarium.position.set(0, 0, 0);
    
    // Enable shadows
    aquarium.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;    
            node.receiveShadow = true; 
        }
    });

    scene.add(aquarium);

    // Play Animation if exists
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(aquarium);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }
    
    // START THE FISH POV SEQUENCE ONCE LOADED
    startFishSequence();

}, undefined, (error) => {
    console.error('Error loading aquarium:', error);
});


// ==========================================
// THE FISH POV SEQUENCE
// ==========================================

// 1. Set Initial Position (High above the tank)
camera.position.set(0, 15, 10); 
camera.rotation.set(-Math.PI / 4, 0, 0); // Look down slightly

function startFishSequence() {
    const tl = gsap.timeline();

    // PHASE 1: THE DROP (Fall into the water)
    // Fall from y=15 down to y=2 (inside the tank)
    tl.to(camera.position, {
        y: 2,
        duration: 2,
        ease: "bounce.out" // Bounces like hitting water density
    });

    // Reset rotation to look straight ahead (level out)
    tl.to(camera.rotation, {
        x: 0,
        z: 0, // Ensure no tilt
        duration: 1
    });

    // PHASE 2: CONFUSION (Yaw Left and Right)
    // Look Left
    tl.to(camera.rotation, {
        y: 1.5, // Turn head left
        duration: 0.8,
        ease: "power2.inOut"
    });
    // Look Right
    tl.to(camera.rotation, {
        y: -1.5, // Turn head right
        duration: 0.8,
        ease: "power2.inOut"
    });
    // Center
    tl.to(camera.rotation, {
        y: 0,
        duration: 0.5
    });

    // PHASE 3: ZOOM IN / ZOOM OUT (The "What is that?" effect)
    // Move forward fast
    tl.to(camera.position, {
        z: 4, // Get close
        duration: 0.5,
        ease: "power2.out"
    });
    // Move back
    tl.to(camera.position, {
        z: 10, // Back up
        duration: 1,
        ease: "power2.inOut"
    });

    // PHASE 4: THE SWIM (Infinite Loop)
    // We add a function at the end of the timeline to start the infinite swimming loop
    tl.call(startSwimmingLoop);
}

function startSwimmingLoop() {
    // 1. Infinite Forward Movement (Swimming around the room)
    // We move from Z=10 to Z=-10, then flip and come back? 
    // Or just patrol forward. Let's patrol forward and backward.
    
    const swimTl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Swim Forward to the back of the room
    swimTl.to(camera.position, {
        z: -5, 
        duration: 8,
        ease: "sine.inOut"
    });

    // 2. The "Wobble" (Yawing left and right while swimming)
    // Fish don't swim in straight lines, they wiggle.
    const wiggleTl = gsap.timeline({ repeat: -1, yoyo: true });
    
    wiggleTl.to(camera.rotation, {
        y: 0.2, // Slight turn left
        duration: 1.5,
        ease: "sine.inOut"
    });
    wiggleTl.to(camera.rotation, {
        y: -0.2, // Slight turn right
        duration: 1.5,
        ease: "sine.inOut"
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    
    renderer.render(scene, camera);
}
animate();