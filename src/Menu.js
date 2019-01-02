import * as BABYLON from 'babylonjs';
import Planet from './Planet';
import config from './config';

export default class {
    constructor(engine, canvas, assetsManager) {

        this.assetsManager = assetsManager;
        this.engine = engine;
        this.canvas = canvas;

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.ambientColor = new BABYLON.Color3(0, 0, 0);
        // this.scene.clearColor = BABYLON.Color3.Black();
    }

    setup() {

        console.log('Init Menu');

        var element = document.querySelector("body");
        element.classList.add("scanlines");
        

        var camera = new BABYLON.FreeCamera("menuCamera", new BABYLON.Vector3(0, 5, -10), this.scene);

        camera.setTarget(BABYLON.Vector3.Zero());

        // camera.attachControl(this.canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);


        let sun = new BABYLON.PointLight("sunMenu", new BABYLON.Vector3(-7, 3, -7), this.scene);
		sun.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
		sun.specular = new BABYLON.Color3(0, 0, 0);
		sun.intensity = 3;
		// sun.shadowMinZ = 30;
		// sun.shadowMaxZ = 1800000;

        // Default intensity is 1. Let's dim the light a small amount
        // light.intensity = 0.7;

        
        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, this.scene);
        // sphere.position.y = 1;



        this.skybox = BABYLON.Mesh.CreateBox("skyBox", 30, this.scene);
        this.skybox.position = new BABYLON.Vector3(0, 0, 0);

        this.skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", this.scene);
        this.skyboxMaterial.backFaceCulling = false;
        // this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/space/space", this.scene);

        this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);

        this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.skybox.material = this.skyboxMaterial;

        if (config.skyBoxInfiniteDistance) {
            this.skybox.infiniteDistance = true;
            this.skybox.renderingGroupId = 0;
        }

        this.planet = new Planet(this.scene, this.engine, this.assetsManager, "Menu");

        this.createLogo();
    }

    createLogo(){
        var n = document.createElement('h1');
        n.setAttribute('class', 'logo');

        let content = `Antimatter`;

        n.innerHTML = content;

        document.body.appendChild(n);

        this.createStartText();
    }

    createStartText(){
        var n = document.createElement('p');
        n.setAttribute('class', 'startText');

        let content = `START GAME`;

        n.innerHTML = content;

        document.body.appendChild(n);
    }

}