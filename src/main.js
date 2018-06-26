import * as BABYLON from 'babylonjs';
import 'babylonjs-procedural-textures';
// import * as GUI from 'babylonjs-gui';
import 'babylonjs-loaders';

import config from './config';

import Ship from './Ship';
import Spacestation from './Spacestation';
import Planet from './Planet';
import CameraManager from './CameraManager';
import InputManager from './InputManager';
import Helper from './helper/Helper';
import PostProcesses from './PostProcesses';
import Asteroids from './Asteroids';
import GUI from './GUI';

var canvas = document.getElementById("canvasZone");
var engine = new BABYLON.Engine(canvas, true, { stencil: true });
engine.displayLoadingUI();
engine.disableManifestCheck = true;

var scene = new BABYLON.Scene(engine);
scene.clearColor = BABYLON.Color3.Black();
scene.collisionsEnabled = true;
scene.checkCollisions = true;

var ship, spaceStation, planet, helper, asteroids;


var createScene = function () {

	var helper = new Helper(scene);
	var assetsManager = new BABYLON.AssetsManager(scene);

	ship = new Ship(scene, assetsManager);
	spaceStation = new Spacestation(scene, assetsManager);
	planet = new Planet(scene, assetsManager);
	asteroids = new Asteroids(scene, assetsManager);


	assetsManager.onFinish = function (tasks) {
		setup();
		engine.runRenderLoop(function () {
			scene.render();
		});
	};

	assetsManager.load();
	return scene;
}

var setup = function () {

	// Add Skybox
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 30000, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("light", scene);

	skyboxMaterial.backFaceCulling = false;
	// skybox.infiniteDistance = true;
	// skybox.renderingGroupId = 0;
	skyboxMaterial.disableLighting = true;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

	var cameraManager = new CameraManager(scene, canvas, ship);

	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
	light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);
	light.intensity = 0.3;

	var sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(-30000, 0, 50), scene);
	// sun.excludedMeshes = [planet.atmosphere];
	sun.intensity = 100;
	sun.shadowMinZ = 30;
	sun.shadowMaxZ = 180;

	var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", sun, scene);
	var flare00 = new BABYLON.LensFlare(0.1, 0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", lensFlareSystem);
	var flare01 = new BABYLON.LensFlare(0.4, 0.1, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare02 = new BABYLON.LensFlare(0.2, 0.2, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare02 = new BABYLON.LensFlare(0.1, 0.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", lensFlareSystem);
	var flare03 = new BABYLON.LensFlare(0.3, 0.4, new BABYLON.Color3(0.5, 0.5, 1), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare2.png", lensFlareSystem);
	var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare02 = new BABYLON.LensFlare(0.1, 1.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare03 = new BABYLON.LensFlare(0.15, 1.4, new BABYLON.Color3(0.5, 0.5, 1.0), "assets/textures/flares/Flare.png", lensFlareSystem);
	var flare04 = new BABYLON.LensFlare(0.05, 1.5, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", lensFlareSystem);



	var inputManager = new InputManager(scene, ship, cameraManager);
	var PostProgress = new PostProcesses(scene, cameraManager.camera);
	var GUIClass = new GUI(scene, cameraManager, asteroids);

	if(config.enableVR){

		var vrHelper = scene.createDefaultVRExperience({
			createDeviceOrientationCamera: false
		});

		var vrCamera = vrHelper.webVRCamera;
	}


	var StationBottom = scene.getMeshByName("StationBottom");
	var StationTop = scene.getMeshByName("StationTop");
	var StationRing = scene.getMeshByName("StationRing");
	var StationMiddle = scene.getMeshByName("StationMiddle");

	var stations = [StationBottom, StationTop, StationRing, StationMiddle];
	var scaleVal = 0.001;

	console.log(cameraManager.camera);

	engine.runRenderLoop(() => {
		if(config.enableVR){
			vrCamera.position = ship.ship.position.add(new BABYLON.Vector3(0, 4, -16));
		}


		// console.log(StationBottom.scaling.x);
		// console.log(BABYLON.Vector3.Distance(ship.ship.position,StationRing.position));
		// var distance = BABYLON.Vector3.Distance(ship.ship.position, StationRing.position);

		// if(distance > 3500 && distance < 4000){
		// 	for (let i = 0; i < stations.length; i++) {
		// 		stations[i].scaling.x -= scaleVal;
		// 		stations[i].scaling.y -= scaleVal;
		// 		stations[i].scaling.z -= scaleVal;
				
		// 	}
		// } else if(distance < 3500 && distance > 3000){
		// 	for (let i = 0; i < stations.length; i++) {
		// 		stations[i].scaling.x += scaleVal;
		// 		stations[i].scaling.y += scaleVal;
		// 		stations[i].scaling.z += scaleVal;
				
		// 	}
		// }
		planet.planet.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
		planet.atmosphere.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
		StationRing.rotate(BABYLON.Axis.Y, -0.0002, BABYLON.Space.LOCAL);
		inputManager.checkKeys(engine);
	});
}


var scene = createScene();
window.addEventListener("resize", function () {
	engine.resize();
});