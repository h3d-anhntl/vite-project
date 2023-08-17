import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);

//init camera
camera.position.z = 45
camera.position.x = 3;
camera.position.y = 20;

//renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true;

//controls
const controls = new OrbitControls( camera, renderer.domElement);
// controls.target = new THREE.Vector3(0,0,-40);
// controls.update();

const plane = new THREE.Mesh( new THREE.PlaneGeometry(200,200), new THREE.MeshPhongMaterial({color: 0xFFBA86}));
plane.rotation.x = - Math.PI / 2
plane.receiveShadow = true;
scene.add(plane);

// //init hemisphere light
scene.add( new THREE.AmbientLight(0xffffff, 2));

// //point light
const light1 = new THREE.PointLight(0xff6666, 500, 100);
light1.castShadow = true;
light1.shadow.mapSize.width = 4096;
light1.shadow.mapSize.height = 4096;
scene.add(light1);

// const light2 = new THREE.PointLight(0x33ff33, 1, 100);
// light2.castShadow = true;
// light2.shadow.mapSize.width = 4096;
// light2.shadow.mapSize.height = 4096;
// scene.add(light2);

//text loading

const loader = new FontLoader();
loader.load('../../../font/Montserrat_Bold.json', function(font){
    const geometry = new TextGeometry('Hi.\nHow are you?', {
        font: font,
        size: 6,
        height: 2,
    })
    
    const textMesh = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({color: 0xF6635C}), //front
        new THREE.MeshPhongMaterial({color: 0x5c2301}) //side
    ])
    
    // textMesh.castShadow = true;
    textMesh.position.y += 15
    textMesh.position.z -= 40
    textMesh.position.x = 5
    textMesh.rotation.y = -0.5
    scene.add(textMesh);
})

loader.load('../../../font/Social Circles_Regular.json', function(font){
    const geometry = new TextGeometry('ifyt', {
        font: font,
        size: 10,
        height: 2,
    })
    
    const iconMesh = new THREE.Mesh(geometry, [
        new THREE.MeshPhongMaterial({color: 0xC23373}), //front
        new THREE.MeshPhongMaterial({color: 0x5c2301}) //side
    ])
    
    // textMesh.castShadow = true;
    iconMesh.position.y += 1
    iconMesh.position.z = -6
    iconMesh.position.x -= 40
    iconMesh.rotation.y = 0.5
    scene.add(iconMesh);
})


//animation
function animate() {
    const now = Date.now()/1000;
    light1.position.y = 15;
    light1.position.x = Math.cos(now) * 20;
    light1.position.z = Math.sin(now) * 20;

    // light2.position.y = 15;
    // light2.position.x = Math.sin(now) * 20;
    // light2.position.z = Math.cos(now) * 20;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

document.body.appendChild(renderer.domElement);
animate();