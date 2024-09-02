import { GLTFLoader} from "three/addons";

const gltfLoader = new GLTFLoader();
export function loadGltf(path, scene, onLoaded) {
    gltfLoader.load(
        path,
        (gltf) => {
            const root = gltf.scene;
            scene.add(root);
            onLoaded(root);
        },
        undefined,
        (err) => {console.log(err)}
    )
}