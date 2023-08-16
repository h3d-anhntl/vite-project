import * as THREE from 'three';

function CreateAScene () {
	//Scence
	const scene = new THREE.Scene();

	// //light
	// const light = new THREE.PointLight(0xffffff, 1, 100)
	// light.position.set(0,10,10)
	// scene.add(light)

	// //Camera
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.z = 10
	// scene.add(camera)

	// //Renderer
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth/2, window.innerHeight/2 , false);
	document.body.appendChild( renderer.domElement );

	// //Create our sphere
	const geometry = new THREE.SphereGeometry(3, 64, 64)
	const material = new THREE.MeshBasicMaterial({
		color: "#00FF83",
	})
	const mesh = new THREE.Mesh(geometry, material)
	scene.add(mesh)


	renderer.render(scene, camera)
}
export default CreateAScene

