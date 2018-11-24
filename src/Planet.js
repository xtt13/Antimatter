import * as BABYLON from 'babylonjs';
import config from './config';

export default class {
    constructor(scene, engine, assetsManager) {
        this.scene = scene;
        this.engine = engine;
        this.assetsManager = assetsManager;

        this.planetDiameter = 12000;

        if(config.disablePlanet) return;
        this.loadPlanet();
    }

    loadPlanet() {
        this.planetMaterial = new BABYLON.StandardMaterial('planetMaterial', this.scene);
        this.planetMaterial.specularPower = 2048;
        // Remove Light Reflection
        this.planetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.planetMaterial.diffuseColor = new BABYLON.Color3(0.8, 1, 0.6);
        this.planetMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.05, 0.05);

        var loadPlanetTexture = this.assetsManager.addTextureTask("planetTexture", "/assets/textures/planets/8k_mars.jpg");
        // var loadPlanetBumpTexture = this.assetsManager.addTextureTask("bumpTexture", "/assets/textures/planets/earthUV.jpg");

        loadPlanetTexture.onSuccess = (task) => {
            this.planetMaterial.diffuseTexture = task.texture;
        }

        // loadPlanetBumpTexture.onSuccess = (task) => {
        //     this.planetMaterial.bumpTexture = task.texture;
	    //     this.planetMaterial.bumpTexture.level = 2;
        // }

        loadPlanetTexture.onError = function (task, message, exception) {
            console.log(message, exception);
        }

        // loadPlanetBumpTexture.onError = function (task, message, exception) {
        //     console.log(message, exception);
        // }

        this.planet = BABYLON.MeshBuilder.CreateSphere("planet", {
            diameter: this.planetDiameter,
            diameterX: this.planetDiameter
        }, this.scene);

        if(config.planetInfiniteDistance){
            this.planet.infiniteDistance = true;
            // this.planet.renderingGroupId = 1;
        }
        // this.planet.renderingGroupId = 1;
        this.planet.material = this.planetMaterial;
        this.planet.position = new BABYLON.Vector3(10000, 0, 50);
    
        this.planet.collisionsEnabled = true;
        this.planet.checkCollisions = true;
        this.planet.isPickable = true;
        this.planet.isBlocker = true;  

        console.log(this.planet);

        var fresnelMaterial = new BABYLON.StandardMaterial('athmosphereMaterial', this.scene);

        fresnelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
        fresnelMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    
        fresnelMaterial.alpha = 0;
        fresnelMaterial.specularPower = 10;
    
    
        fresnelMaterial.opacityFresnelParameters = new BABYLON.FresnelParameters();
        fresnelMaterial.opacityFresnelParameters.bias = 0.7;
        fresnelMaterial.opacityFresnelParameters.power = 10;
        // fresnelMaterial.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        // fresnelMaterial.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();
    
        this.atmosphere = BABYLON.MeshBuilder.CreateSphere("earth", {
            diameter: this.planetDiameter,
            diameterX: this.planetDiameter
        }, this.scene);

        if(config.planetInfiniteDistance){
            this.atmosphere.infiniteDistance = true;
            // this.atmosphere.renderingGroupId = 2;
        }
        this.atmosphere.position = this.planet.position;
        this.atmosphere.material = fresnelMaterial;
        this.atmosphere.isBlocker = true; 

        this.engine.runRenderLoop(() => {
            this.planet.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
            this.atmosphere.rotate(BABYLON.Axis.Y, -0.00005, BABYLON.Space.LOCAL);
        });

    }


}