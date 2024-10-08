import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPixelatedPass} from 'three/addons';
import {CSS2DRenderer, CSS2DObject} from "three/addons";

import {loadGltf} from '/home/oleksii/js/floppy_disk/app/utils';
import {KeyboardHandler} from "./keyboard";
import {handleMouseEvent} from './mouse';

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
// TODO rework this as css in styles css file
const displayArea = document.createElement('textarea');
displayArea.style.width = '600px';
displayArea.style.height = '100px';
displayArea.style.borderStyle = 'dashed';
displayArea.style.borderColor = '#00ff00'
displayArea.style.color = '#00ff00';
displayArea.style.fontFamily = 'Monocraft';
displayArea.style.backgroundColor = 'rgba(0, 0, 0, 0)';
displayArea.value = 'USE THE KEYBOARD';

const displayObj = new CSS2DObject(displayArea);
displayObj.position.set(1, 1.2, 0);
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
    '/floppy_disk.gltf',
    scene,
    (model) => {
        floppy = model;

        // global position
        floppy.position.z = -2.8;
        floppy.position.x = -0.5;
        floppy.rotateZ(-1.5);

        // main floppy frame
        const floppy_frame = floppy.getObjectByName('main_frame');
        floppy_frame.material = floppy_frame.material.clone();
        floppy_frame.material.color.set(0x0000ff);
    }
)

let mouse;
loadGltf(
    '/mouse.gltf',
    scene,
    (model) => {
        mouse = model;
        mouse.position.z = 3;
    }
);

let macintosh;
loadGltf(
    '/macintosh.gltf',
    scene,
    (model) => {
        macintosh = model;
        macintosh.rotateY(3.14);
    }
)

// handling keyboard
const keyboardHandler = new KeyboardHandler(displayArea);

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

// handling mouse
addEventListener('mousedown', (event) => handleMouseEvent(event, mouse));
addEventListener('mouseup', (event) => handleMouseEvent(event, mouse));

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
