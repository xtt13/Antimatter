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

// Import Menu
import Menu from './Menu';

// Import GUI
import GUI from './GUI';

// Import Ship & Cockpit
import Ship from './ship/Ship';
import Cockpit from './ship/Cockpit';

// Import Space
import Planet from './Planet';
import Centauri from './Centauri';
import Asteroids from './Asteroids';
import Spacestation from './Spacestation';
import JumpGate from './JumpGate';
import Arc from './Arc';


export default class {
	constructor() {

		// Get Quality Settings from Local Storage
		this.qualitySettings = localStorage.getItem('qualitySettings');
		if (this.qualitySettings == undefined || this.qualitySettings == 'auto') {
			this.qualitySettings = false;
		} else if (this.qualitySettings == 'high') {
			this.qualitySettings = true;
		}

		// Log Quality Settings
		console.log('QualitySettings: ' + this.qualitySettings);

		// Get Canvas
		this.canvas = document.getElementById("canvasZone");

		// Init Engine
		this.engine = new BABYLON.Engine(
			this.canvas,

			// antialias
			true,

			{
				// stencil: true
			},

			// Adapt to Device Ratio
			this.qualitySettings
		);

		// Set Current State (Game or Menu)
		this.currentState = config.currentState;

		// Disable Manifest Model Warning
		this.engine.disableManifestCheck = true;

		// Init Scene
		this.scene = new BABYLON.Scene(this.engine);

		this.scene.clearColor = BABYLON.Color3.Black();

		this.scene.autoClear = false;

		this.scene.autoClearDepthAndStencil = false;

		// Backside Shadow Color
		this.scene.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2);

		this.scene.workerCollisions = true;


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

		this.cockpit = new Cockpit(this);

		this.ship = new Ship(this);

		this.spaceStation = new Spacestation(this);

		this.planet = new Planet(this, "Game");

		this.centauri = new Centauri(this);

		this.arc = new Arc(this);

		this.asteroids = new Asteroids(this);

		this.jumpGate = new JumpGate(this);

		this.menu = new Menu(this);

		// Log Remaining Assets
		this.assetsManager.onProgress = (remainingCount, totalCount, task) => {
			console.log(remainingCount, totalCount, task.name);
		}

		// When all assets are loaded =>
		this.assetsManager.onFinish = (tasks) => {

			switch (this.currentState) {
				case "Game":

					// Run Setup
					this.setup();
					break;

				case "Menu":

					// Run Menu
					this.menu.setup();
					break;

				default:
					throw new Error('Unknown State');
			}


			// runRenderLoop => Render Scene
			this.engine.runRenderLoop(() => {
				switch (this.currentState) {
					case "Game":
						this.scene.render();
						break;

					case "Menu":
						this.menu.scene.render();
						break;

					default:
						throw new Error('No default scene!');
						break;
				}

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
		this.cameraManager = new CameraManager(this);

		// Init Input Manager
		this.inputManager = new InputManager(this);

		// Init PostProcess
		this.PostProcess = new PostProcesses(this);

		// Init GUI
		this.GUIClass = new GUI(this);




		// Create Box (Mesh) for Skybox
		if (!config.disableSkybox) {

			// Create Mesh for the skybox
			this.skybox = BABYLON.Mesh.CreateBox("skyBox", config.skyBoxSize, this.scene);

			// Set Skybox Position
			this.skybox.position = new BABYLON.Vector3(0, 0, 0);

			// Create Skybox Material
			this.skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", this.scene);
			this.skyboxMaterial.backFaceCulling = false;

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
			}
		}

		// Create Sun Mesh
		this.sunMesh = BABYLON.MeshBuilder.CreateSphere("checkpoint", { diameter: 1000 }, this.scene);
		this.sunMesh.position = new BABYLON.Vector3(-30000, 0, 50);

		var sunMeshMat = new BABYLON.StandardMaterial("sunMeshMat", this.scene);

		sunMeshMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
		sunMeshMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
		sunMeshMat.specularColor = new BABYLON.Color3(1, 1, 1);

		this.sunMesh.material = sunMeshMat;


		// Create Sun Light
		this.sun = new BABYLON.PointLight("sun", new BABYLON.Vector3(-30000, 0, 50), this.scene);
		this.sun.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
		this.sun.specular = new BABYLON.Color3(0, 0, 0);
		this.sun.intensity = 1000000000;
		this.sun.shadowMinZ = 30;
		this.sun.shadowMaxZ = 1800000;
		this.sun.excludedMeshes = [this.cockpit.cylinder];

		// Uncomment for VolumetricLightScatteringPostProcess
		// var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, this.cameraManager.camera, this.sun, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.engine, false);

		// Create Lensflares
		this.lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", this.sun, this.scene);
		var flare00 = new BABYLON.LensFlare(0.1, 0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem);
		var flare01 = new BABYLON.LensFlare(0.4, 0.1, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare02 = new BABYLON.LensFlare(0.2, 0.2, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare02 = new BABYLON.LensFlare(0.1, 0.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem);
		var flare03 = new BABYLON.LensFlare(0.3, 0.4, new BABYLON.Color3(0.5, 0.5, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare2.png", this.lensFlareSystem);
		var flare05 = new BABYLON.LensFlare(0.8, 1.0, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare02 = new BABYLON.LensFlare(0.1, 1.3, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare03 = new BABYLON.LensFlare(0.15, 1.4, new BABYLON.Color3(0.5, 0.5, 1.0), "assets/textures/flares/Flare.png", this.lensFlareSystem);
		var flare04 = new BABYLON.LensFlare(0.05, 1.5, new BABYLON.Color3(1, 1, 1), "assets/textures/flares/Flare3.png", this.lensFlareSystem);

		// Create Shadow Generator
		this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.sun);
		this.shadowGenerator.setDarkness(0.5);

		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationBottom);
		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationTop);
		this.shadowGenerator.getShadowMap().renderList.push(this.spaceStation.StationMiddle);

		// Better Blur => More Costs
		// this.shadowGenerator.useBlurExponentialShadowMap = true;

		this.shadowGenerator.useKernelBlur = true;
		this.shadowGenerator.blurKernel = 64;

		this.collisionSoundSwitch = true;
		this.startUpIntro = true;

		this.asteroidsMoving = [];

		// If Collision on Spawn -> Ignore
		setTimeout(() => {
			this.startUpIntro = false;
		}, 8000);

		this.scene.registerBeforeRender(() => {

			for (let i = 0; i < this.asteroidsMoving.length; i++) {
				let element = this.asteroidsMoving[i];
				element.translate(BABYLON.Axis.Y, 0.04, BABYLON.Space.WORLD);
				element.rotate(BABYLON.Axis.X, 0.003, BABYLON.Space.WORLD);
			}

			for (let i = 0; i < this.asteroids.asteroids.length; i++) {
				let asteroid = this.asteroids.asteroids[i];

				var label = null;

				if (this.cockpit.laserMesh.intersectsMesh(asteroid, true) && !asteroid.currentlyMining) {

					this.cockpit.stopLaser();

					asteroid.currentlyMining = true;

					this.asteroids.addMiningLabel(asteroid);

					this.asteroids.addCustomOutline(asteroid);

					this.cockpit.startMining(asteroid);

					this.GUIClass.enableAsteroidScreen();

				} else {

					if (!this.cockpit.laserMesh.intersectsMesh(asteroid, true) && asteroid.currentlyMining) {
						asteroid.currentlyMining = false;

						this.asteroids.removeLabel(asteroid.label);

						this.asteroids.removeCustomOutline(asteroid);

						this.cockpit.stopMining();
					}

				}

				if (this.cockpit.cockpit.intersectsMesh(asteroid, false)) {

					this.asteroidsMoving.push(asteroid);

					// If Startup Time is gone
					if (!this.startUpIntro) {
						this.inputManager.airSpeed = 0;

						let newVal;
						if (this.SoundManager.engineSound._playbackRate > 1) {
							newVal = this.SoundManager.engineSound._playbackRate -= 0.5;
						} else {
							newVal = 1;
						}

						this.SoundManager.engineSound.updateOptions({ playbackRate: newVal });

						this.inputManager.disableKeys();

						if (this.collisionSoundSwitch) {
							this.collisionSoundSwitch = false;
							this.collisionSound = new BABYLON.Sound("collisionSound", "assets/audio/sound/collision.mp3", this.scene, null,
								{
									volume: 0.5,
									autoplay: true
								}
							);

							this.alarmSound = new BABYLON.Sound("alarmSound", "assets/audio/sound/alarm.mp3", this.scene, null,
								{
									playbackRate: 1,
									volume: 0.3,
									loop: true,
									autoplay: true
								})

							setTimeout(() => {
								this.boardComputerDamages = new BABYLON.Sound("boardComputerDamages", "assets/audio/sound/boardComputerDamages.mp3", this.scene, null,
									{
										playbackRate: 1,
										volume: 1,
										autoplay: true
									})
							}, 3000);

							let hudAInterval = setInterval(() => {
								if (this.cockpit.hudA.material.pointsCloud == false) {
									this.cockpit.hudA.material.pointsCloud = true;
								} else {
									this.cockpit.hudA.material.pointsCloud = false;
								}
							}, 50);

							let hudBInterval = setInterval(() => {
								if (this.cockpit.hudB.material.alpha == 0) {
									this.cockpit.hudB.material.alpha = 1;
								} else {
									this.cockpit.hudB.material.alpha = 0;
								}
							}, 80);

							setTimeout(() => {
								clearInterval(hudAInterval);
								clearInterval(hudBInterval);

								this.alarmSound.stop();

								this.cockpit.hudA.material.pointsCloud = true;
								this.cockpit.hudB.material.alpha = 0;

								this.bootUp = new BABYLON.Sound("bootUp", "assets/audio/sound/bootup.mp3", this.scene, null,
									{
										playbackRate: 1,
										volume: 0.5,
										autoplay: true
									});

								setTimeout(() => {
									let hudBIntervalAlpha = setInterval(() => {
										if (this.cockpit.hudB.material.alpha < 1) {
											this.cockpit.hudB.material.alpha += 0.005;
										} else {
											clearInterval(hudBIntervalAlpha);
											this.cockpit.hudA.material.pointsCloud = false;
										}
									}, 10);

									setTimeout(() => {
										this.inputManager.enableKeys();
									}, 2000);

								}, 3000);
							}, 5000);

							// this.cameraManager.shake(false, false, 100);

							this.collisionSound.onended = () => {
								this.collisionSoundSwitch = true;
							};
						}
					}


				}


			}

		});

		this.engine.runRenderLoop(() => {

			// Check if Keys are pressed
			this.inputManager.checkKeys(this.engine);
			
		});

	}
}