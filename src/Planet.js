import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(game, type) {
        this.game = game;
        this.scene = game.scene;
        this.engine = game.engine;
        this.assetsManager = game.assetsManager;
        this.type = type;

        switch (type) {
            case "Menu":
                this.planetDiameter = 8;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                break;

            case "Game":
                this.planetDiameter = 70000;
                this.x = 50000;
                this.y = 0;
                this.z = 50;
                break;

            default:
                throw new Error('Unknown State');
        }

        this.segments = 128;

        if (config.disablePlanet) return;
        this.loadPlanet();
    }

    loadPlanet() {
        this.planetMaterial = new BABYLON.StandardMaterial('planetMaterial', this.scene);

        // Remove Light Reflection
        this.planetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.planetMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        this.planetMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.05, 0.05);

        // Old
        if (this.type == "Menu") {
            this.planetMaterial.diffuseTexture = new BABYLON.Texture("./assets/textures/planets/8k_mars.jpg", this.scene);
        }

        if (this.isMobileDevice()) {
            console.log('mob');
            var loadPlanetTexture = this.assetsManager.addTextureTask("loadPlanetTexture", "./assets/textures/planets/2k_mars.jpg");
        } else {
            var loadPlanetTexture = this.assetsManager.addTextureTask("loadPlanetTexture", "./assets/textures/planets/8k_mars.jpg");
        }

        loadPlanetTexture.onSuccess = (task) => {
            this.planetMaterial.diffuseTexture = task.texture;
        }

        loadPlanetTexture.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        this.planet = BABYLON.MeshBuilder.CreateSphere("planet", {
            segments: this.segments,
            diameter: this.planetDiameter,
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

        var fresnelMaterial = new BABYLON.StandardMaterial('athmosphereMaterial', this.scene);

        fresnelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        fresnelMaterial.alpha = 0;
        fresnelMaterial.specularPower = 13;


        fresnelMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
        fresnelMaterial.opacityFresnelParameters.bias = 0.3;
        fresnelMaterial.opacityFresnelParameters.power = 5;
        fresnelMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        fresnelMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

        this.atmosphere = BABYLON.MeshBuilder.CreateSphere("athmosphere", {
            segments: this.segments,
            diameter: this.planetDiameter,
        }, this.scene);

        if (config.planetInfiniteDistance && this.type == "Game") {
            this.atmosphere.infiniteDistance = true;
        }
        this.atmosphere.position = this.planet.position;
        this.atmosphere.material = fresnelMaterial;
        this.atmosphere.isBlocker = true;

        this.engine.runRenderLoop(() => {
            if (this.type == "Menu") {
                this.planet.rotate(BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL);
                this.atmosphere.rotate(BABYLON.Axis.Y, -0.0001, BABYLON.Space.LOCAL);
            } else {
                this.planet.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
                this.atmosphere.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
            }
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