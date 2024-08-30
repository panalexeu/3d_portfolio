import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPixelatedPass} from 'three/addons';

import {loadGltf} from '/utils';
import {handleKeyDown} from "./keyboard";

// setting up scene, camera, renderer, controls
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = -5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ambient light
const light = new THREE.AmbientLight(0x404040, 25);
scene.add(light)

// axes
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper)

// controller
const control = new OrbitControls(camera, renderer.domElement);

// postprocessing
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const renderPixelatedPass = new RenderPixelatedPass(3, scene, camera);
composer.addPass(renderPixelatedPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

// models
let keyboard;
loadGltf(
    '/keyboard.gltf',
    scene,
    (model) => { keyboard = model; },
);

// handling input
addEventListener('keydown', (event) => handleKeyDown(event, keyboard))


// animation loop
function animate() {
    composer.render();
    control.update();
}

renderer.setAnimationLoop(animate);
