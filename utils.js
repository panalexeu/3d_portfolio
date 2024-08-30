import {GLTFLoader} from "three/addons/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();
export function load_gltf(path, scene) {
    let model;

    gltfLoader.load(
        '/keyboard.gltf',
        (gltf) => {
            const root = gltf.scene;
            model = root;
            scene.add(root);
        }
    )

    return model;
}