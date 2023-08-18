import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// DECLARE COMPOSER, MIXER, AND THETA
let composer;
let body_01_mixer, eyes_01_mixer;

//Scene
const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper(5)) // trục tọa độ

// ADD ENVIRONMENT LIGHT
const hdrEquirect = new RGBELoader()
	.load( 'https://miroleon.github.io/daily-assets/gradient.hdr', function () {
  
  // TRY OTHER HDRs
//   .load( 'https://miroleon.github.io/daily-assets/GRADIENT_01_01_comp.hdr', function () {
  //.load( 'https://miroleon.github.io/daily-assets/gradient_13.hdr', function () {
  //.load( 'https://miroleon.github.io/daily-assets/gradient_4_comp.hdr', function () {
  //.load( 'https://miroleon.github.io/daily-assets/gradient_5_comp.hdr', function () {
    
  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
});

// USE THE HDR AS THE SCENE'S ENVIRONMENT
scene.environment = hdrEquirect;

//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
// camera.position.x = 100;
camera.position.z = 20;
camera.position.y = 40;

//light
scene.add( new THREE.AmbientLight(0xffffff, 2));
const light = new THREE.PointLight(0xffffff, 1000)
scene.add(light);


//renderer
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x11151c);

document.body.appendChild(canvas);


const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.target.set(0, 1, 0)


// MATERIAL FOR THE BLOB WHICH USES THE HDR TO GET IT'S COLOUR THROUGH REFLECTIONS
var blob_mat = new THREE.MeshPhysicalMaterial({
  
    // WHITE COLOUR TO GET MORE REFLECTIONS
    color: 0xffffff,
    
    // ROUGHNESS TO GIVE THE MATERIAL A SOFT PLASTIC LOOK
    roughness: 0.3,
    
    // NO MATELNESS IN ORDER NOT TO MAKE THE MATERIAL TO SHINY
    metalness: 0,
    
    // USE THE HDR AS THE ENVIRONMENT MAP
    envMap: hdrEquirect,
    
    // DECLARE HOW MUCH OF AN EFFECT THE HDR HAS ON THE MATERIAL
    envMapIntensity: 0.5
  });

//model
const fbxLoader = new FBXLoader();
fbxLoader.load( './Sad Walk.fbx', function ( object ) {
    object.position.set( 0, -5, 0);
    object.scale.setScalar(0.03);
    body_01_mixer = new THREE.AnimationMixer(object);
    const body_01_action = body_01_mixer.clipAction(object.animations[0]);
    body_01_action.play();

    object.traverse( function (child) {
        if(child.isMesh) {
            //ADD THE MATERIAL TO THE 3D MODEL
            child.material = blob_mat;
        }
    })

	scene.add( object );

},(xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
},
(error) => {
    console.log(error)
} );

// ADD FOG TO THE SCENE
// REGULAR 'FOG' TO FADE TO THE BACKGROUND COLOUR (NOT NECESSARY HERE)
scene.fog = new THREE.Fog( 0x11151c, 1, 100 );

// 'FOGEXP2' FOR CONTROLLING FOG DENSITY (IMPROTANTLY PLAYS TOGETHER WITH THE BLOOM LATER)
// MORE DENSITY = DARKER
// FIRST VALUE IS FOG COLOUR, SECOND VALUE IS FOG DENSITY
// FOG DESNITY ALSO DEPENDS ON THE DISTANCE BETWEEN CAMERA AND OBJECT (JUST AS IRL)
scene.fog = new THREE.FogExp2(0x11151c, 0.015);

// POST PROCESSING
// ADD A RENDERPASS TO COMBINE THE POST PROCESSING WITH THE SCENE WE CREATED ABOVE
const renderScene = new RenderPass( scene, camera );

// ADD THE POST PROCESSING TO THE COMPOSER
composer = new EffectComposer( renderer );
composer.addPass( renderScene );


let theta1 = 0;
// DECLARE ALL THAT YOU WANT TO UDPATE CONTINUOUSLY IN THE UPDATE FUNCTION AND CALL IT LATER IN THE ANIMATE FUNCTION
var update = function() {
    // MAKE THE THETA1 COUNT UP BY USING += SO THAT THE SIN AND COS FUNCTIONS DRAW A GRAPH
    // ALTERNATIVELY YOU COULD ALSO USE THE CLOCK HERE
    theta1 += 0.005;
    
    // BY USING THE SIN ON THE X AXIS AND THE COS ON THE Z AXIS, WE MOVE AROUND THE OBJECT IN A CIRCLE
    camera.position.x = -Math.sin(theta1+1)*45;
    camera.position.z = -Math.cos(theta1+1)*45;
    
    // UP AND DOWN MOVEMENT OF THE CAMERA
    camera.position.y = 20*Math.cos(theta1+1)+20;
  
    // IN ORDER FOR THE CAMERA TO MOVE AROUND THE OBJECT BUT STILL LOOK AT IT AT EVERY FRAME WE NEED TO ADD THE camera.lookAt INSIDE OF THE UPDATE FUNCTION
      camera.lookAt( 0, 5, 0 );
  
  }

const clock = new THREE.Clock()
function animate() {
    const delta = clock.getDelta();

    // controls.update();
    // USE THE MIXER'S UPDATE FUNCTION TO KEEP THE ANIMATION RUNNING CONTINOUSLY (BY DIVIDING OR MULTIPLYING THE DELTA VALUE WE CAN MAKE THE ANIMATION RUN SLOWER OR FASTER)
    if ( body_01_mixer ) body_01_mixer.update( delta/2 );

     // CALL THE UPDATE FUNCTION FROM ABOVE
    update();

    // UPDATE THE COMPOSER
    composer.render();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
