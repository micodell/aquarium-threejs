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
camera.rotation.order = 'YXZ';

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
const angle = Math.PI; // 90 degrees in Radians

// Math to place camera in a circle around the target
camera.position.x = target.x;
camera.position.y = target.y;
camera.position.z = target.z;

controls.update();

// --- !! LIGHTS !! ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft black light
scene.add(ambientLight);

// Directional Light (Buat cahaya besar dari depan kaca)
const dirLight = new THREE.DirectionalLight(0xffffff, 1); // Increase intensity to 2
dirLight.position.set(0, 20, 60); // Cahaya dari kaca depan aquarium
dirLight.target.position.set(0, 2, -20); // Pointing to inside the aquarium
dirLight.castShadow = true; // <--- LIGHT MUST CAST SHADOW
// const helper = new THREE.DirectionalLightHelper( dirLight, 20 );
// scene.add( helper );

// SpotLight (Buat cahaya dari atas aquarium)
const spotLight = new THREE.SpotLight(
    0x8ae1ff,   // warna kebiruan (air friendly)
    100,          // intensity (cukup terang)
    100,         // distance
    THREE.MathUtils.degToRad(60), // sudut cone
    0.3,        // penumbra (soft edge)
    1           // decay (realistic falloff)
);

// POSISI DI LUAR AQUARIUM
spotLight.position.set(0, 35, -30);

// TARGET KE DALAM AQUARIUM
spotLight.target.position.set(0, 2, -20);

// SHADOW SETTINGS
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(2048, 2048);
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
// spotLight.shadow.focus = 1;
const spothelper = new THREE.DirectionalLightHelper( spotLight, 20 );
scene.add( spothelper );

const s = 15;
spotLight.shadow.camera.left = -s;
spotLight.shadow.camera.right = s;
spotLight.shadow.camera.top = s;
spotLight.shadow.camera.bottom = -s;

scene.add(spotLight);
scene.add(spotLight.target);

const spotLight2 = new THREE.SpotLight(
    0x8ae1ff,   // warna kebiruan (air friendly)
    100,          // intensity (cukup terang)
    100,         // distance
    THREE.MathUtils.degToRad(60), // sudut cone
    0.3,        // penumbra (soft edge)
    1           // decay (realistic falloff)
);

// POSISI DI LUAR AQUARIUM
spotLight2.position.set(40, 35, -30);

// TARGET KE DALAM AQUARIUM
spotLight2.target.position.set(40, 2, -20);

// SHADOW SETTINGS
spotLight2.castShadow = true;
spotLight2.shadow.mapSize.set(2048, 2048);
spotLight2.shadow.camera.near = 1;
spotLight2.shadow.camera.far = 100;
// spotLight2.shadow.focus = 1;
const spothelper2 = new THREE.DirectionalLightHelper( spotLight2, 20 );
scene.add( spothelper2 );

const s2 = 15;
spotLight2.shadow.camera.left = -s2;
spotLight2.shadow.camera.right = s2;
spotLight2.shadow.camera.top = s2;
spotLight2.shadow.camera.bottom = -s2;

scene.add(spotLight2);
scene.add(spotLight2.target);

const spotLight3 = new THREE.SpotLight(
    0x8ae1ff,   // warna kebiruan (air friendly)
    100,          // intensity (cukup terang)
    100,         // distance
    THREE.MathUtils.degToRad(60), // sudut cone
    0.3,        // penumbra (soft edge)
    1           // decay (realistic falloff)
);

// POSISI DI LUAR AQUARIUM
spotLight3.position.set(-40, 35, -30);

// TARGET KE DALAM AQUARIUM
spotLight3.target.position.set(-40, 2, -20);

// SHADOW SETTINGS
spotLight3.castShadow = true;
spotLight3.shadow.mapSize.set(2048, 2048);
spotLight3.shadow.camera.near = 1;
spotLight3.shadow.camera.far = 100;
// spotLight3.shadow.focus = 1;
const spothelper3 = new THREE.DirectionalLightHelper( spotLight3, 20 );
scene.add( spothelper3 );

const s3 = 15;
spotLight3.shadow.camera.left = -s3;
spotLight3.shadow.camera.right = s3;
spotLight3.shadow.camera.top = s3;
spotLight3.shadow.camera.bottom = -s3;
scene.add(spotLight3);
scene.add(spotLight3.target);

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
const camState = {
    x: 10,
    y: 20,
    z: 40,
    rotX: -1,
    rotY: 6.2,
    rotZ: 0
};
camera.position.set(camState.x, camState.y, camState.z); 
camera.rotation.set(camState.rotX, camState.rotY, camState.rotZ);
var distance = 0;


function startFishSequence() {
    const tl = gsap.timeline();

    function calculateForwardMove(distance) {
        camState.x -= distance * Math.sin(camState.rotY);
        camState.z -= distance * Math.cos(camState.rotY);
    }

    // guide:
    // x kanan/kiri
    // y tinggi/rendah
    // z maju/mundur

    // fase 0: dituang dari atas aquarium
    // the drop from above the aquarium to inside
    camState.y -= 60
    tl.to(camera.position, {
        y: camState.y,
        duration: 2,
        ease: "bounce(0.5)"
    });
    camState.rotX += 1; // up
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
    });

    // fase 1: bingung, mengenali env sekitarnya
    camState.rotX += 0.5; // up
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
    });
    camState.rotY += 1; // left
    tl.to(camera.rotation, {
        y: camState.rotY,
        duration: 2,
        ease: "power1.inOut"
    });
    camState.rotY -= 0.5; // right
    tl.to(camera.rotation, {
        y: camState.rotY,
        duration: 2,
        ease: "power1.inOut"
    });
    camState.rotY -= 1.6; // right
    tl.to(camera.rotation, {
        y: camState.rotY,
        duration: 2,
        ease: "power1.inOut"
    });


    // fase 2: melihat makanan (up then zoom), go there, eat
    camState.rotX += 0.4; // up
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
    });
    // const food = new THREE.Vector3(60, 40, 22);
    tl.to(camera, {
        fov: 20, // zoom-in
        duration: 3,
        ease: "power3.out",
        onUpdate: () => camera.updateProjectionMatrix()
        // onUpdate: () => { camera.updateProjectionMatrix(); camera.lookAt(food); }
    });
    tl.to(camera, {
        fov: 75, // zoom-out
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => camera.updateProjectionMatrix()
    });

    distance = 77;
    camState.y += distance;
    camState.x -= 0 + (45 * Math.sin(camState.rotY));
    camState.z -= -5 + (45 * Math.cos(camState.rotY));
    camState.rotX -= 0.4; // down
    tl.to(camera.position, {
        x: camState.x,
        y: camState.y,
        z: camState.z,
        duration: 8,
        ease: "power1.inOut"
    }).to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 8,
        ease: "power1.inOut",
    }, "<");

    tl.to(camera.position, { // break sebentar
        x: camState.x,
        y: camState.y,
        z: camState.z,
        duration: 1,
        ease: "power1.inOut"
    });
    tl.to(camera.rotation, {
        x: "+=0.2", // eat: up and down
        duration: 0.4,
        yoyo: true,
        repeat: 6,
        ease: "sine.inOut"
    });
    camState.y -= 10; // down
    tl.to(camera.position, {
        y: camState.y,
        duration: 1,
        ease: "power1.inOut"
    });
    tl.to(camera.position, { // break sebentar
        x: camState.x,
        y: camState.y,
        z: camState.z,
        duration: 1,
        ease: "power1.inOut"
    });


    // fase 3: selesai makan, swim down
    camState.rotX -= 2; // down
    camState.rotY += 2.5; // left sampai balik 180
    calculateForwardMove(distance);
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
    });

    distance = 2;
    camState.y -= distance;
    camState.x -= 4 + (45 * Math.sin(camState.rotY));
    camState.z -= 4 + (45 * Math.cos(camState.rotY));
    camState.rotX += 1.2; // up
    calculateForwardMove(distance);
    tl.to(camera.position, {
        y: camState.y,
        duration: 3,
        ease: "power1.inOut"
    }).to(camera.rotation, {
        x: camState.rotX,
        // y: camState.rotY,
        z: 0,
        duration: 3,
        ease: "power1.inOut",
    }, "<");

    camState.rotY += 0.1; // left
    calculateForwardMove(distance);
    tl.to(camera.rotation, {
        y: camState.rotY,
        duration: 2,
        ease: "power1.inOut"
    });

    // fase 4: swim, terambang-ambang oleh bubbles, menoleh ke bubbles
    distance = 6;
    camState.x += distance;
    camState.z -= 0 + (45 * Math.cos(camState.rotY));
    camState.y += 4;
    camState.rotZ += 2; // tilt left
    camState.rotY -= 3.2; // right
    calculateForwardMove(distance);
    tl.to(camera.position, {
        x: camState.x,
        z: camState.z,
        duration: 8,
        ease: "power1.inOut"
    }).to(camera.position, {
        y: camState.y,
        duration: 0.4,
        yoyo: true,
        repeat: 10,
        ease: "sine.inOut"
    }).to(camera.rotation, {
        y: camState.rotY,
        z: camState.rotZ,
        duration: 2,
        ease: "power1.inOut"
    }, "<");
    camState.rotZ -= 2; // tilt right
    distance = 4; // swim
    camState.x += distance;
    calculateForwardMove(distance);
    tl.to(camera.rotation, {
        z: camState.rotZ,
        duration: 2,
        ease: "power1.inOut"
    }).to(camera.position, {
        x: camState.x,
        duration: 2,
        ease: "power1.inOut"
    }, "<");

    camState.x += 1;
    camState.rotX -= 1; // down
    camState.rotY -= 1.6; // right
    calculateForwardMove(distance);
    tl.to(camera.position, {
        x: camState.x,
        duration: 3,
        ease: "power1.inOut"
    }).to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 3,
        ease: "power1.inOut",
    }, "<");
    camState.rotX += 1; // up
    camState.rotY += 0.8; // left
    calculateForwardMove(distance);
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 3,
        ease: "power1.inOut",
    });
    distance = 10; // swim
    camState.x += distance;
    calculateForwardMove(distance);
    tl.to(camera.position, {
        x: camState.x,
        duration: 2,
        ease: "power1.inOut"
    });
    camState.rotY += 1; // left
    calculateForwardMove(distance);
    tl.to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 3,
        ease: "power1.inOut",
    });

    // fase 5: swim
    distance = 30;
    camState.x += distance;
    camState.z -= -5 + (45 * Math.cos(camState.rotY));
    camState.rotX -= 0.8; // down
    calculateForwardMove(distance);
    tl.to(camera.position, {
        x: camState.x,
        // y: camState.y,
        z: camState.z,
        duration: 8,
        ease: "power1.inOut"
    }).to(camera.rotation, {
        // x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 8,
        ease: "power1.inOut",
    }, "<");

    
    // swim (loop)
    tl.call(startSwimmingLoop);
}

function startSwimmingLoop() {
    const swimTl = gsap.timeline({ repeat: -1, yoyo: true });
    // swim
    camState.x -= 50
    swimTl.to(camera.position, {
        x: camState.x, 
        duration: 10,
        ease: "strong.inOut"
    });

    const wiggleTl = gsap.timeline({ repeat: -1, yoyo: true });
    wiggleTl.to(camera.rotation, {
        y: camState.rotY +0.02, // slight left
        duration: 1,
        ease: "sine.inOut"
    });
    wiggleTl.to(camera.rotation, {
        y: camState.rotY -0.02, // slight right
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

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).add(forward.multiplyScalar(10));

    // updateMovement();
    // controls.update();
    renderer.render(scene, camera);
}
animate();