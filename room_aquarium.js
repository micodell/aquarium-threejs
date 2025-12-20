import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';


// 1. Setup Scene and Clock for animation :)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); 

const clock = new THREE.Clock();
let mixer;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// --- RENDERER SETTINGS ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer, nicer shadows
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// --- ENVIRONMENT ---
const pmremGenerator = new THREE.PMREMGenerator(renderer);
// scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

// --- SETUP CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; // Adds inertia (smooth slowing down)
controls.dampingFactor = 0.05;
controls.enablePan = false;    // Disable right-click dragging (keeps camera centered)

// Limit how far they can zoom in/out (optional)
controls.minDistance = 1;
controls.maxDistance = 25;

// 1. Define the Target (Where the camera looks)
// const target = new THREE.Vector3(-30, 4, 6);
const target = new THREE.Vector3(10, 30, 0);
controls.target.copy(target);

// 2. Calculate Camera Position for 90-degree start
// We position the camera relative to the target
const distance = 15; // How far away from the target
const angle = Math.PI; // 90 degrees in Radians

// Math to place camera in a circle around the target
camera.position.x = target.x;
camera.position.y = target.y;
camera.position.z = target.z;

controls.update();

// --- !! LIGHTS !! ---
const ambientLight = new THREE.AmbientLight(0x1a2a33, 0.5); // Soft black light
scene.add(ambientLight);

// Directional Light (Buat cahaya besar dari depan kaca)
const dirLight = new THREE.DirectionalLight(0xffffff, 2); // Increase intensity to 2
dirLight.position.set(0, 20, 60); // Cahaya dari kaca depan aquarium
dirLight.target.position.set(0, 2, -20); // Pointing to inside the aquarium
dirLight.castShadow = true; // <--- LIGHT MUST CAST SHADOW
// const helper = new THREE.DirectionalLightHelper( dirLight, 20 );
// scene.add( helper );

// SpotLight (Buat cahaya dari atas aquarium)
const spotLight = new THREE.SpotLight(
    0xaadfff,   // warna kebiruan (air friendly)
    15,          // intensity (cukup terang)
    30,         // distance
    THREE.MathUtils.degToRad(60), // sudut cone
    0.4,        // penumbra (soft edge)
    2           // decay (realistic falloff)
);

// POSISI DI LUAR AQUARIUM
spotLight.position.set(0, 30, -30);

// TARGET KE DALAM AQUARIUM
spotLight.target.position.set(0, 2, -20);

// SHADOW SETTINGS
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 40;
spotLight.shadow.focus = 1;
const helper = new THREE.DirectionalLightHelper( spotLight, 20 );
scene.add( helper );

const s = 15;
spotLight.shadow.camera.left = -s;
spotLight.shadow.camera.right = s;
spotLight.shadow.camera.top = s;
spotLight.shadow.camera.bottom = -s;

scene.add(spotLight);
scene.add(spotLight.target);

// FIX SHADOW QUALITY (Defaults are pixelated and small)
dirLight.shadow.mapSize.width = 2048; // Higher res shadows
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;

// Expand the shadow camera area so it covers the whole room
const d = 15;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;

scene.add(dirLight);

const centerLight = new THREE.PointLight(0xff0000, 1, 10); // Red light, intensity 1, range 10m
centerLight.position.set(0, 2, 0); // Hanging 2 meters in the air
scene.add(centerLight);

// 2. Load GLBs
const aquariumLoader = new GLTFLoader();
aquariumLoader.load('models/room_aquarium_now_animated.glb', (gltf) => {
    const aquarium = gltf.scene;
    aquarium.position.set(0, 0, 0);
    aquarium.scale.set(1, 1, 1); 

    aquarium.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;    // The object throws a shadow
            node.receiveShadow = true; // The object can have shadows fall on it
        }
    });

    scene.add(aquarium);

    // gltf.animations is an array of all clips (Animation A, Animation B, etc.)
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(aquarium);
        const clip = gltf.animations[0];
        const action = mixer.clipAction(clip);
        action.play();
    }

    startFishSequence();

}, undefined, (error) => {
    console.error('Error loading aquarium:', error);
});

// camera.position.set(0, 0, 0);

// 3. GSAP Logic
// Set Initial Position (High above the tank)
var x_pos = 10, y_pos = 20, z_pos = 40;
camera.position.set(x_pos, y_pos, z_pos); 
var x_rot = 0, y_rot = 6.2, z_rot = 0;
camera.rotation.set(x_rot, y_rot, z_rot);

function startFishSequence() {
    const tl = gsap.timeline();

    // guide:
    // x kanan/kiri
    // y tinggi/rendah
    // z maju/mundur

    // the drop from above the aquarium to inside
    tl.to(camera.position, {
        y: y_pos +2,
        duration: 2,
        ease: "bounce.out"
    });

    // tolah-toleh like confused
    tl.to(camera.rotation, {
        y: y_rot +1, // left
        duration: 4,
        ease: "power1.inOut"
    });
    tl.to(camera.rotation, {
        y: y_rot -1, // right
        duration: 4,
        ease: "power1.inOut"
    });
    // back to center
    tl.to(camera.rotation, {
        y: y_rot +0,
        duration: 4,
        ease: "power1.inOut"
    });
    // to right
    tl.to(camera.rotation, {
        y: y_rot -1, // right
        duration: 4,
        ease: "power1.inOut"
    });

    // // ndangak
    // tl.to(camera.position, {
    //     z: z_pos +1.5, // up
    //     duration: 4,
    //     ease: "power2.inOut"
    // });

    // // zoom-in, zoom-out
    // tl.to(camera.position, {
    //     z: z_pos +10, // zoom-in
    //     duration: 4,
    //     ease: "power2.out"
    // });
    // tl.to(camera.position, {
    //     z: z_pos +10, // zoom-out
    //     duration: 4,
    //     ease: "power2.inOut"
    // });

    // swim (loop)
    tl.call(startSwimmingLoop);
}

function startSwimmingLoop() {
    const swimTl = gsap.timeline({ repeat: -1, yoyo: true });
    // swim
    swimTl.to(camera.position, {
        z: z_pos -50, 
        duration: 10,
        ease: "strong.inOut"
    });

    const wiggleTl = gsap.timeline({ repeat: -1, yoyo: true });
    wiggleTl.to(camera.rotation, {
        y: y_rot +0.02, // slight left
        duration: 1,
        ease: "sine.inOut"
    });
    wiggleTl.to(camera.rotation, {
        y: y_rot -0.02, // slight right
        duration: 1,
        ease: "sine.inOut"
    });
}

// --- KEYBOARD CONTROLS SETUP ---
const keyState = {};
const moveSpeed = 0.5; // Walk speed
const turnSpeed = 0.01; // Look speed (how fast you turn)

window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

function updateMovement() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    const moveVector = new THREE.Vector3(0, 0, 0);

    if (keyState['KeyW']) moveVector.addScaledVector(forward, moveSpeed);
    if (keyState['KeyS']) moveVector.addScaledVector(forward, -moveSpeed);
    if (keyState['KeyA']) moveVector.addScaledVector(right, -moveSpeed);
    if (keyState['KeyD']) moveVector.addScaledVector(right, moveSpeed);

    camera.position.add(moveVector);
    controls.target.add(moveVector);

    if (keyState['ArrowLeft'] || keyState['ArrowRight']) {
        const offset = new THREE.Vector3().subVectors(controls.target, camera.position);
        const direction = keyState['ArrowLeft'] ? 1 : -1;
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnSpeed * direction);
        controls.target.copy(camera.position).add(offset);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }
    // updateMovement();
    // controls.update();
    renderer.render(scene, camera);
}
animate();