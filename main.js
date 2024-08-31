import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPixelatedPass} from 'three/addons';
import {CSS2DRenderer, CSS2DObject} from "three/addons";

import {loadGltf} from '/utils';
import {KeyboardHandler} from "./keyboard";

// setting up scene, camera, renderers, controls
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

const css2dRenderer = new CSS2DRenderer();
css2dRenderer.setSize(window.innerWidth, window.innerHeight);
css2dRenderer.domElement.style.position = 'absolute';
css2dRenderer.domElement.style.top = '0px';
css2dRenderer.domElement.style.pointerEvents = 'none';  // important thing, allows orbit controls to works with css2d renderer
document.body.appendChild(css2dRenderer.domElement);

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

// CSS2d object display creation
const displayDiv = document.createElement('div');
displayDiv.textContent = '';
displayDiv.style.backgroundColor = 'white';

const displayObj = new CSS2DObject(displayDiv);
displayObj.position.set(1, 1, 0);
scene.add(displayObj)

// models
let keyboard;
loadGltf(
    '/keyboard.gltf',
    scene,
    (model) => {
        keyboard = model;
        keyboard.rotateY(3.14);
    },
);

let floppy;
loadGltf(
    '/floppy_disk_shades.gltf',
    scene,
    (model) => {
        floppy = model;

        // global position
        floppy.position.z = 3;

        // main floppy frame
        const floppy_frame = floppy.getObjectByName('main_frame');
        floppy_frame.material = floppy_frame.material.clone();
        floppy_frame.material.color.set(0x0000ff);
    }
)

// handling keyboard
const keyboardHandler = new KeyboardHandler(displayDiv);

addEventListener('keydown', (event) =>
    keyboardHandler.handleKeyEvent(
        event,
        keyboard
    )
);
addEventListener('keyup', (event) =>
    keyboardHandler.handleKeyEvent(
        event,
        keyboard
    )
);

// animation loop
function animate() {
    control.update();
    render();
}

function render() {
    composer.render();
    css2dRenderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
