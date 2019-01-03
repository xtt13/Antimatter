import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;


        this.planetDiameter = 40000;

        this.x = -1000;
        this.y = 60000;
        this.z = 50;

        this.segments = 128;


        // // - Zu Mir, + Weg von mir
        // this.x = 25000;

        // // - Nach Unten , + Nach Oben
        // this.y = -35000;

        // // + Nach Link, - Nach Rechts
        // this.z = 0;


        this.loadPlanet();

    }

    loadPlanet() {

        var loadPlanetTexture = this.assetsManager.addTextureTask("centauriTexture", "./assets/textures/planets/Planet_Beta_Hydri.jpg");

        loadPlanetTexture.onSuccess = (task) => {

            this.planetMaterial.diffuseTexture = task.texture;
        }

        loadPlanetTexture.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        this.planetMaterial = new BABYLON.StandardMaterial('planetMaterial', this.scene);
        this.planetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.planetMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        this.planetMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.05, 0.05);

        // this.planetMaterial.diffuseTexture = new BABYLON.Texture("./assets/textures/planets/Planet_Beta_Hydri.jpg", this.scene);


        this.planet = BABYLON.MeshBuilder.CreateSphere("planet", {
            segments: this.segments,
            diameter: this.planetDiameter,
            // diameterX: this.planetDiameter
        }, this.scene);


        if (config.planetInfiniteDistance && this.type == "Game") {
            this.planet.infiniteDistance = true;
        }

        this.planet.material = this.planetMaterial;
        this.planet.position = new BABYLON.Vector3(this.x, this.y, this.z);

        this.planet.collisionsEnabled = true;
        this.planet.checkCollisions = true;
        this.planet.isPickable = true;
        this.planet.isBlocker = true;

        this.planet.isVisible = false;

        var fresnelMaterial = new BABYLON.StandardMaterial('athmosphereMaterial', this.scene);

        fresnelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        fresnelMaterial.alpha = 0;
        fresnelMaterial.specularPower = 13;


        fresnelMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
        fresnelMaterial.opacityFresnelParameters.bias = 0.5;
        fresnelMaterial.opacityFresnelParameters.power = 5;
        fresnelMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        fresnelMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        this.atmosphere = BABYLON.MeshBuilder.CreateSphere("athmosphere", {
            segments: this.segments,
            diameter: this.planetDiameter,
            // diameterX: this.planetDiameter
        }, this.scene);

        if (config.planetInfiniteDistance && this.type == "Game") {
            this.atmosphere.infiniteDistance = true;
            // this.atmosphere.renderingGroupId = 2;
        }
        this.atmosphere.position = this.planet.position;
        this.atmosphere.material = fresnelMaterial;
        this.atmosphere.isBlocker = true;


        // var gizmoManager = new BABYLON.GizmoManager(this.scene);
        // gizmoManager.positionGizmoEnabled = true;
        // gizmoManager.rotationGizmoEnabled = true;
        // gizmoManager.scaleGizmoEnabled = true;
        // gizmoManager.boundingBoxGizmoEnabled = true;
        // gizmoManager.attachableMeshes = [this.planet, this.atmosphere];

        this.engine.runRenderLoop(() => {
            this.planet.rotate(BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL);
            this.atmosphere.rotate(BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL);
        });

    }

    isMobileDevice() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    }

    deletePlanet() {
        this.planet.dispose();
        this.atmosphere.dispose();
    }


}