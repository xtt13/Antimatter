import * as BABYLON from 'babylonjs';

import 'babylonjs-procedural-textures';
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
import MusicManager from './MusicManager';
import SoundManager from './SoundManager';
import JumpGate from './JumpGate';
import Cockpit from './Cockpit';
import Wormhole from './Wormhole';

export default class {
	constructor() {
		this.canvas = document.getElementById("canvasZone");

		this.engine = new BABYLON.Engine(this.canvas, true, {
			stencil: true
		});

		this.engine.disableManifestCheck = true;

		// this.engine.loadingUIText = "Year 2200";
		this.engine.hideLoadingUI();

		this.scene = new BABYLON.Scene(this.engine);
		this.scene.clearColor = BABYLON.Color3.Black();
		this.scene.checkCollisions = true;
		this.scene.gravity = new BABYLON.Vector3(0, 0, 0);
		this.scene.collisionsEnabled = true;
		this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);


		this.ship = null;
		this.spaceStation = null;
		this.planet = null;
		this.helper = null;
		this.asteroids = null;

		this.createScene();

	}

	createScene() {

		this.helper = new Helper(this.scene);
		this.assetsManager = new BABYLON.AssetsManager(this.scene);
		this.MusicManager = new MusicManager(this.scene, this.assetsManager);
		this.SoundManager = new SoundManager(this.scene, this.assetsManager);

		this.ship = new Ship(this.scene, this.assetsManager);
		this.cockpit = new Cockpit(this.scene, this.assetsManager, this.ship.ship, this.engine);

		this.spaceStation = new Spacestation(this.scene, this.engine, this.assetsManager);
		this.planet = new Planet(this.scene, this.engine, this.assetsManager);
		this.asteroids = new Asteroids(this.scene, this.assetsManager);
		this.jumpGate = new JumpGate(this.scene, this.engine, this.assetsManager)

		this.assetsManager.onFinish = (tasks) => {
			this.setup();
			this.engine.runRenderLoop(() => {
				this.scene.render();
			});
		};

		window.addEventListener("resize", () => {
			this.engine.resize();
		});

		this.assetsManager.load();


	}

	setup() {

		// Add Skybox
		this.skybox = BABYLON.Mesh.CreateBox("skyBox", config.skyBoxSize, this.scene);
		this.skybox.position = new BABYLON.Vector3(0, 0, 0);
		this.skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", this.scene);


		this.skyboxMaterial.backFaceCulling = false;
		if (config.skyBoxInfiniteDistance) {
			this.skybox.infiniteDistance = true;
			this.skybox.renderingGroupId = 0;
		}

		// this.skyboxMaterial.disableLighting = true;
		this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
		this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		this.skybox.material = this.skyboxMaterial;





		this.cameraManager = new CameraManager(this.scene, this.canvas, this.ship, this.cockpit, this);
		this.SoundManager.initSound(this.cameraManager);

		this.wormhole = new Wormhole(this.scene, this.engine, this.assetsManager, this.cameraManager.camera, this);


		this.sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(-30000, 0, 50), this.scene);
		this.sun.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
		this.sun.specular = new BABYLON.Color3(0, 0, 0);
		// this.sun.excludedMeshes = [planet.atmosphere];
		this.sun.intensity = 1000000000;
		this.sun.shadowMinZ = 30;
		this.sun.shadowMaxZ = 1800000;

		var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", this.sun, this.scene);
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

		this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sun);
		this.shadowGenerator.getShadowMap().renderList.push(this.cockpit.cockpit);
		
		this.inputManager = new InputManager(this.scene, this.ship, this.cockpit, this.cameraManager, this);
		this.PostProgress = new PostProcesses(this.scene, this.cameraManager.camera);
		this.GUIClass = new GUI(this.scene, this.cameraManager, this.asteroids);


		// Shadows
		// var shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sun);
		// shadowGenerator.addShadowCaster(this.ship.ship);
		// shadowGenerator.useExponentialShadowMap = true;
		// shadowGenerator.usePoissonSampling = true;

		this.scene.registerBeforeRender(() => {

		})



		this.engine.runRenderLoop(() => {
			this.inputManager.checkKeys(this.engine);
		});
	}
}