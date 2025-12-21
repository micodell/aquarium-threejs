import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();

// 1. Setup Scene and Clock for animation :)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);
scene.fog = new THREE.Fog(0x001e0f, 0.1, 800); // Color, Near, Far

const clock = new THREE.Clock();
let mixer;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
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
const ambientLight = new THREE.AmbientLight(0x3d85c6, 1.15); // Soft black light
scene.add(ambientLight);

// Directional Light (Buat cahaya besar dari depan kaca)
const dirLight = new THREE.DirectionalLight(0x9fc5e8, 0.3); // Increase intensity to 2
dirLight.position.set(0, 20, 60); // Cahaya dari kaca depan aquarium
dirLight.target.position.set(0, 2, -20); // Pointing to inside the aquarium
dirLight.castShadow = true; // <--- LIGHT MUST CAST SHADOW
// const helper = new THREE.DirectionalLightHelper( dirLight, 20 );
// scene.add( helper );

// SpotLight (Buat cahaya dari atas aquarium)
const spotLight = new THREE.SpotLight(
    0x8fdcff,   // warna kebiruan (air friendly)
    100,          // intensity (cukup terang)
    120,         // distance
    THREE.MathUtils.degToRad(70), // sudut cone
    0.6,        // penumbra (soft edge)
    1           // decay (realistic falloff)
);

// POSISI DI LUAR AQUARIUM
spotLight.position.set(0, 40, -30);

// TARGET KE DALAM AQUARIUM
spotLight.target.position.set(0, 2, -20);

// SHADOW SETTINGS
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(2048, 2048);
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 120;
spotLight.shadow.bias = -0.0005; // Reduce shadow acne
// const spothelper = new THREE.DirectionalLightHelper( spotLight, 20 );
// scene.add( spothelper );

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
// const spothelper2 = new THREE.DirectionalLightHelper( spotLight2, 20 );
// scene.add( spothelper2 );

const s2 = 15;
spotLight2.shadow.camera.left = -s2;
spotLight2.shadow.camera.right = s2;
spotLight2.shadow.camera.top = s2;
spotLight2.shadow.camera.bottom = -s2;

// Ga pake
// scene.add(spotLight2);
// scene.add(spotLight2.target);

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
// const spothelper3 = new THREE.DirectionalLightHelper( spotLight3, 20 );
// scene.add( spothelper3 );

const s3 = 15;
spotLight3.shadow.camera.left = -s3;
spotLight3.shadow.camera.right = s3;
spotLight3.shadow.camera.top = s3;
spotLight3.shadow.camera.bottom = -s3;
// Ga pake
// scene.add(spotLight3);
// scene.add(spotLight3.target);

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

const centerLight = new THREE.PointLight(0xffffff, 150, 240); // White light, intensity 1, range 10m
centerLight.position.set(-60, -20, -10); // Hanging 2 meters in the air
scene.add(centerLight);
// helper
// const pointLightHelper = new THREE.PointLightHelper(centerLight, 5);
// scene.add(pointLightHelper);

// scene.fog = new THREE.Fog(
//     0x0b1e2d,  // warna air gelap
//     -30,        // mulai
//     150         // habis
// );

// Stripe Light (LED aquarium)
const stripeLight = new THREE.RectAreaLight(
    0x9fe7ff,   // warna LED aquarium
    15,         // intensity (besar tapi lembut)
    60,         // width (panjang aquarium)
    6           // height (tebal lampu)
);

// posisi tepat di atas air
stripeLight.position.set(0, 45, 34);
stripeLight.rotation.x = -Math.PI / 2; // menghadap ke bawah

scene.add(stripeLight);

// Glow Stripe
const stripeGlowGeo = new THREE.PlaneGeometry(180, 2);
const stripeGlowMat = new THREE.MeshBasicMaterial({
    color: 0x9fe7ff,
    transparent: true,
    opacity: 1
});

const stripeGlow = new THREE.Mesh(stripeGlowGeo, stripeGlowMat);
stripeGlow.position.set(0, 45, 34);
stripeGlow.rotation.x = Math.PI / 2;

scene.add(stripeGlow);

// Stripe Light (LED aquarium)
const stripeLight2 = new THREE.RectAreaLight(
    0x9fe7ff,   // warna LED aquarium
    15,         // intensity (besar tapi lembut)
    60,         // width (panjang aquarium)
    6           // height (tebal lampu)
);

// posisi tepat di atas air
stripeLight2.position.set(0, 44, 22);
stripeLight2.rotation.x = -Math.PI / 2; // menghadap ke bawah

scene.add(stripeLight);

// Glow Stripe
const stripeGlowGeo2 = new THREE.PlaneGeometry(180, 2);
const stripeGlowMat2 = new THREE.MeshBasicMaterial({
    color: 0x9fe7ff,
    transparent: true,
    opacity: 1
});

const stripeGlow2 = new THREE.Mesh(stripeGlowGeo2, stripeGlowMat2);
stripeGlow2.position.set(0, 45, 22);
stripeGlow2.rotation.x = Math.PI / 2;

scene.add(stripeGlow2);

// Stripe Light (LED aquarium)
const stripeLight3 = new THREE.RectAreaLight(
    0x9fe7ff,   // warna LED aquarium
    15,         // intensity (besar tapi lembut)
    60,         // width (panjang aquarium)
    6           // height (tebal lampu)
);

// posisi tepat di atas air
stripeLight3.position.set(0, 45, -24);
stripeLight3.rotation.x = -Math.PI / 2; // menghadap ke bawah

scene.add(stripeLight3);

// Glow Stripe
const stripeGlowGeo3 = new THREE.PlaneGeometry(180, 2);
const stripeGlowMat3 = new THREE.MeshBasicMaterial({
    color: 0x9fe7ff,
    transparent: true,
    opacity: 1
});

const stripeGlow3 = new THREE.Mesh(stripeGlowGeo3, stripeGlowMat3);
stripeGlow3.position.set(0, 45, -24);
stripeGlow3.rotation.x = Math.PI / 2;

scene.add(stripeGlow3);

// Stripe Light (LED aquarium)
const stripeLight4 = new THREE.RectAreaLight(
    0x9fe7ff,   // warna LED aquarium
    15,         // intensity (besar tapi lembut)
    60,         // width (panjang aquarium)
    6           // height (tebal lampu)
);

// posisi tepat di atas air
stripeLight4.position.set(0, 45, -36);
stripeLight4.rotation.x = -Math.PI / 2; // menghadap ke bawah

scene.add(stripeLight4);

// Glow Stripe
const stripeGlowGeo4 = new THREE.PlaneGeometry(180, 2);
const stripeGlowMat4 = new THREE.MeshBasicMaterial({
    color: 0x9fe7ff,
    transparent: true,
    opacity: 1
});

const stripeGlow4 = new THREE.Mesh(stripeGlowGeo4, stripeGlowMat4);
stripeGlow4.position.set(0, 45, -36);
stripeGlow4.rotation.x = Math.PI / 2;

scene.add(stripeGlow4);


// Glow
const glowGeo = new THREE.PlaneGeometry(30, 4);
const glowMat = new THREE.MeshBasicMaterial({
    color: 0x8fdcff,
    transparent: true,
    opacity: 1
});

const glow = new THREE.Mesh(glowGeo, glowMat);
glow.position.set(0, 43, 0);
glow.rotation.x = Math.PI / 2;
scene.add(glow);
//
//
// // --- GLASS DOOR LIGHT (SUN) ---
// // 0xffdfba is a warm sunlight color
// const sunLight = new THREE.DirectionalLight(0xffdfba, 1);
//
// // Position: Outside the room (e.g., x=50), shining in
// sunLight.position.set(100, 100, 800);
// sunLight.target.position.set(0, 0, 0); // Points to center of room
//
// sunLight.castShadow = true;
//
// // Sharpen the shadows for sunlight
// sunLight.shadow.mapSize.width = 2048;
// sunLight.shadow.mapSize.height = 2048;
// sunLight.shadow.camera.near = 0.5;
// sunLight.shadow.camera.far = 100;
//
// // Ensure the shadow box covers the room
// const d2 = 50;
// sunLight.shadow.camera.left = -d2;
// sunLight.shadow.camera.right = d2;
// sunLight.shadow.camera.top = d2;
// sunLight.shadow.camera.bottom = -d2;
//
// scene.add(sunLight);
// scene.add(sunLight.target);
//
// // The number '5' is the size of the square helper
// const sunHelper = new THREE.DirectionalLightHelper(sunLight, 50);
// scene.add(sunHelper);

// --- CEILING LAMP 1 ---
// 0xffffee is a soft indoor warm white
const ceilingLight1 = new THREE.PointLight(0xffffee, 1000, 1000); // Lower intensity needed now
ceilingLight1.position.set(450, 280, -80);
ceilingLight1.decay = 1; // <--- ADD THIS (Default is 2)
ceilingLight1.distance = 1000; // Limits how far it goes

// Soften shadows for indoor lights
ceilingLight1.shadow.radius = 4; // Makes shadow edges blurry/soft
scene.add(ceilingLight1);

// // The number '1' is the size of the sphere
// const lampHelper1 = new THREE.PointLightHelper(ceilingLight1, 10);
// scene.add(lampHelper1);


// --- CEILING LAMP 2 ---
// 0xffffee is a soft indoor warm white
const ceilingLight2 = new THREE.PointLight(0xffffee, 1000, 1000); // Lower intensity needed now
ceilingLight2.position.set(1800, 200, -120);
ceilingLight2.decay = 1; // <--- ADD THIS (Default is 2)
ceilingLight2.distance = 1000; // Limits how far it goes

// Soften shadows for indoor lights
ceilingLight2.shadow.radius = 4; // Makes shadow edges blurry/soft
scene.add(ceilingLight2);

// // The number '1' is the size of the sphere
// const lampHelper2 = new THREE.PointLightHelper(ceilingLight2, 10);
// scene.add(lampHelper2);

// --- CEILING LAMP 2 ---
// 0xffffee is a soft indoor warm white
const ceilingLight3 = new THREE.PointLight(0xffffee, 200, 1000); // Lower intensity needed now
ceilingLight3.position.set(-600, 50, -600);
ceilingLight3.decay = 1; // <--- ADD THIS (Default is 2)
ceilingLight3.distance = 1000; // Limits how far it goes

// Soften shadows for indoor lights
ceilingLight3.shadow.radius = 4; // Makes shadow edges blurry/soft
scene.add(ceilingLight3);

// // The number '1' is the size of the sphere
// const lampHelper3 = new THREE.PointLightHelper(ceilingLight3, 10);
// scene.add(lampHelper3);

// 2. Load GLBs

// 1. Load the Living Room Environment
const roomLoader = new GLTFLoader();
roomLoader.load('models/living_roomkitchenbedroom.glb', (gltf) => {
    const room = gltf.scene;

    // ADJUSTMENT 1: Scale
    // Living room models from the internet might be huge or tiny.
    // Adjust this until the room looks correct relative to the aquarium.
    room.scale.set(5, 5, 5);


    // ADJUSTMENT 2: Position
    // Lower the room so the floor is below the aquarium.
    // Since your aquarium is at (0,0,0), the floor needs to be lower (e.g., y = -10)
    room.position.set(1350, 340, -100);

    room.rotation.y = Math.PI / 2;

    // Enable shadows for the room
    room.traverse((node) => {
        if (node.isMesh) {
            node.receiveShadow = true; // The floor/walls catch shadows
            node.castShadow = true;    // Window frames/furniture cast shadows
        }

        // Log both the object name AND the material name
        // console.log("Object:", node.name, " | Material:", node.material);

        // // CHECK IF THIS IS THE GLASS PART
        // // (You might need to check the name in Blender if 'Glass' isn't in the name)
        // if (node.name.toLowerCase().includes('glass') || node.name.toLowerCase().includes('window')) {
        //
        //     // 1. Make it visible from both sides
        //     node.material.side = THREE.DoubleSide;
        //
        //     // 2. Make it transparent (if not already)
        //     node.material.transparent = true;
        //     node.material.opacity = 0.3; // Adjust transparency
        //
        //     // 3. THE TRICK: Add Emissive color
        //     // This makes the glass "glow" slightly, simulating light hitting it
        //     node.material.emissive = new THREE.Color(0xffffff);
        //     node.material.emissiveIntensity = 0.2;
        // }
    });

    scene.add(room);

}, undefined, (error) => {
    console.error('Error loading living room:', error);
});

const aquariumLoader = new GLTFLoader();
aquariumLoader.load('models/room_aquarium_now_animated.glb', (gltf) => {
    const aquarium = gltf.scene;
    aquarium.position.set(0, 0, 0);
    aquarium.scale.set(1, 1, 1);

    aquarium.traverse((node) => {
        if (node.isMesh) {
            
            console.log(node.name);

            if (node.name.toLowerCase().includes('bubles')) {
                node.material.transparent = true;
                node.material.opacity = 0.5;
                node.material.depthWrite = false; 
                node.material.side = THREE.DoubleSide; 
                node.castShadow = false; // agar tidak terlihat seperti benda padat
                node.receiveShadow = false;
            } else if (node.material.name.toLowerCase().includes('glass')) {
                node.material.transparent = true;
                node.material.opacity = 0.2;
                node.castShadow = false;
                node.receiveShadow = true;
            } else if (node.material.name.toLowerCase().includes('grass') || node.material.name.toLowerCase().includes('green')) {
                // Contoh warna rumput alami:
                // 0x3e5c28 (Hijau tua hutan - Recommended)
                // 0x5a7d3a (Hijau lumut agak terang)
                // 0x2f451e (Sangat gelap)
                node.material.color.setHex(0x3e5c28);
                node.material.roughness = 0.9;
                node.material.metalness = 0.0;
                node.material.envMapIntensity = 0.5;

                node.castShadow = false;
                node.receiveShadow = true;
            } else if (node.material.name.toLowerCase().includes('blue_algae')) {
                node.material.color.setHex(0xb84c77);
                node.material.roughness = 0.9;
                node.material.metalness = 0.0;
                node.material.envMapIntensity = 0.5;

                node.castShadow = true;
                node.receiveShadow = true;
            } else if (node.material.name.toLowerCase().includes('feed_feed')) {
                node.material.color.setHex(0xb02815);
                node.material.roughness = 0.9;
                node.material.metalness = 0.0;
                node.material.envMapIntensity = 0.5;

                node.castShadow = false;
                node.receiveShadow = true;
            } else if (node.material.name.toLowerCase().includes('feeder')) {
                node.material.color.setHex(0x7876d1);
                node.material.roughness = 0.9;
                node.material.metalness = 0.0;
                node.material.envMapIntensity = 0.5;

                node.castShadow = false;
                node.receiveShadow = true;
            } else if (node.material.name.toLowerCase().includes('stone')) {
                node.material.color.setHex(0x99a5b4);
                node.material.roughness = 0.9;
                node.material.metalness = 0.0;
                node.material.envMapIntensity = 0.1;

                node.castShadow = true;
                node.receiveShadow = true;
            } else {
                node.castShadow = true;
                node.receiveShadow = true;
            }
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

// Audio: Sound Effect
const listener = new THREE.AudioListener();
camera.add(listener);

const splashSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('./media/water-submerge-sound-effect.mp3', function(buffer) {
    splashSound.setBuffer(buffer);
    splashSound.setLoop(false);
    splashSound.setVolume(3.0);
});

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
    // Audio: BGM
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.volume = 0.3;

        if (bgm.paused) {
            bgm.play().catch((error) => {
                console.warn("Autoplay dicegah browser, user harus interaksi dulu:", error);
            });
        }
    }
    if (listener.context.state === 'suspended') {
        listener.context.resume();
    }

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
    tl.call(() => {
        if (splashSound.buffer) {
            if (splashSound.isPlaying) splashSound.stop();
            splashSound.play(); // splash submerge sound effect
        }
    }, null, "<+0.3");
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
    camState.y -= 2; // down
    tl.to(camera.position, {
        y: camState.y,
        duration: 2,
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
        duration: 7,
        ease: "power1.inOut"
    }).to(camera.rotation, {
        // x: camState.rotX,
        y: camState.rotY,
        z: 0,
        duration: 7,
        ease: "power1.inOut",
    }, "<");


    // --- FASE 6: EXIT & ORBIT (New) ---

    // 1. Zoom Out (Escape the tank)
    // Pull camera up and back to see the whole tank
    camState.x = 0; // Center X relative to tank
    camState.y = 20; // High up (above the water/room)
    camState.z = 200; // Far back
    camState.rotX = -0.2; // Look down slightly
    camState.rotY = 0;    // Reset rotation to look forward
    camState.rotZ = 0;    // Reset roll

    // 2. Circle Around the Aquarium (Orbit)
    // We animate a 'dummy' object (angle) from 0 to 360 (2*Math.PI)
    // and calculate X/Z positions in the onUpdate function.
    const orbit = { angle: 0 };
    const radius = 200; // Distance from center

    tl.to(camera.position, {
        x: camState.x,
        y: camState.y,
        z: camState.z,
        duration: 5,
        ease: "power2.inOut",
        onstart: () => {
            scene.fog = null;
        }
    }).to(camera.rotation, {
        x: camState.rotX,
        y: camState.rotY,
        z: camState.rotZ,
        duration: 5,
        ease: "power2.inOut"
    }, "<").to(orbit, {
        angle: Math.PI * 2, // Full 360 circle
        duration: 15,       // Slow rotation
        ease: "none",       // Constant speed
        onUpdate: function() {
            // Calculate circular path
            camera.position.x = radius * Math.sin(orbit.angle);
            camera.position.z = radius * Math.cos(orbit.angle);

            // Force camera to look at center (0,0,0)
            camera.lookAt(0, 0, 0);
        }
    }, "<"); // Run at same time as position move

    tl.to(camera, {
        fov: 60, // zoom-in
        duration: 3,
        ease: "power3.inOut",
        onUpdate: () => camera.updateProjectionMatrix()
    });

    
    // swim (loop)
    // tl.call(startSwimmingLoop);
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
const moveSpeed = 10; // Walk speed
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
    // forward.y = 0;
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