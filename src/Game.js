// Import Babylon.js
import * as BABYLON from 'babylonjs';

// Import Custom Config & Helper
import config from './config';
import Helper from './helper/Helper';

// Import Camera Manager & Post Process
import CameraManager from './CameraManager';
import PostProcesses from './PostProcesses';

// Import Music & Sounds
import MusicManager from './audio/MusicManager';
import SoundManager from './audio/SoundManager';

// Import Input Manager
import InputManager from './controlls/InputManager';

// Import GUI
import GUI from './GUI';

// Import Ship & Cockpit
import Ship from './ship/Ship';
import Cockpit from './ship/Cockpit';

// Import Space
import Planet from './Planet';
import Asteroids from './Asteroids';
import Spacestation from './Spacestation';
import JumpGate from './JumpGate';


export default class {
	constructor() {

		// Get Canvas
		this.canvas = document.getElementById("canvasZone");

		// Init Engine
		this.engine = new BABYLON.Engine(this.canvas, true, {
			// stencil: true
		});

		// Disable Manifest Model Warning
		this.engine.disableManifestCheck = true;

		// Init Scene
		this.scene = new BABYLON.Scene(this.engine);
		this.scene.clearColor = BABYLON.Color3.Black();

		this.scene.checkCollisions = true;
		this.scene.gravity = new BABYLON.Vector3(0, 0, 0);
		this.scene.collisionsEnabled = true;

		// Backside Shadow Color
		this.scene.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		// this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

		// Init Variables
		this.ship = null;
		this.spaceStation = null;
		this.planet = null;
		this.helper = null;
		this.asteroids = null;

		// Create Scene
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


		// When all assets are loaded =>
		this.assetsManager.onFinish = (tasks) => {

			// Run Setup
			this.setup();

			// runRenderLoop => Render Scene
			this.engine.runRenderLoop(() => {
				this.scene.render();
			});
		};

		// On Window Resize => Resize Game
		window.addEventListener("resize", () => {
			this.engine.resize();
		});

		// Finally Start Loading
		this.assetsManager.load();


	}

	setup() {

		// Init Camera Manager
		this.cameraManager = new CameraManager(this.scene, this.canvas, this.ship, this.cockpit, this);

		// Init Input Manager
		this.inputManager = new InputManager(this.scene, this.ship, this.cockpit, this.cameraManager, this);

		// Init PostProcess
		this.PostProcess = new PostProcesses(this.scene, this.cameraManager.camera);

		// Init GUI
		this.GUIClass = new GUI(this.scene, this.cameraManager, this.asteroids);




		// Create Box (Mesh) for Skybox
		if (!config.disableSkybox) {
			this.skybox = BABYLON.Mesh.CreateBox("skyBox", config.skyBoxSize, this.scene);
			this.skybox.position = new BABYLON.Vector3(0, 0, 0);

			// Create Skybox Material
			this.skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", this.scene);
			this.skyboxMaterial.backFaceCulling = false;
			this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/space/space", this.scene);

			// OS and Navigator Detection (Chrome/Mac Texture Limitation Bug)
			if (navigator.platform.indexOf('Mac') > -1 && navigator.userAgent.indexOf("Chrome") > -1) {
				console.log('Low-Res Skybox (macOS & Chrome');
				this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
			} else {
				this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/space/space", this.scene);
			}

			this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

			// Assign material to skybox
			this.skybox.material = this.skyboxMaterial;

			if (config.skyBoxInfiniteDistance) {
				this.skybox.infiniteDistance = true;
				this.skybox.renderingGroupId = 0;
			}
		}

		if(config.createSpaceTunnel){
			this.cockpit.createSpaceTunnel(this.cameraManager, this.inputManager);
		}




		// Create Sun
		this.sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(-30000, 0, 50), this.scene);
		this.sun.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
		this.sun.specular = new BABYLON.Color3(0, 0, 0);
		this.sun.intensity = 1000000000;
		this.sun.shadowMinZ = 30;
		this.sun.shadowMaxZ = 1800000;
		// this.sun.excludedMeshes = [planet.atmosphere];

		// Create Lensflares
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

		// Create Shadow Generator
		this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sun);
		this.shadowGenerator.setDarkness(0.5);


		// this.shadowGenerator.getShadowMap().renderList.push(this.cockpit.cockpit);
		// this.shadowGenerator.getShadowMap().renderList.push(this.jumpGate.jumpGate);

		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationBottom);
		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationTop);
		// this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationRing);
		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationMiddle);

		

		// Better Blur => More Costs
		// this.shadowGenerator.useBlurExponentialShadowMap = true;

		this.shadowGenerator.useKernelBlur = true;
		this.shadowGenerator.blurKernel = 64;




		this.engine.runRenderLoop(() => {

			// Check if Keys are pressed
			this.inputManager.checkKeys(this.engine);
		});
	}
}