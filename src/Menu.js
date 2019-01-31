import * as BABYLON from 'babylonjs';
import Planet from './Planet';
import config from './config';

export default class {
    constructor(game) {
        this.game = game;
        this.assetsManager = game.assetsManager;
        this.engine = game.engine;
        this.canvas = game.canvas;
        

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.ambientColor = new BABYLON.Color3(0, 0, 0);
        this.scene.clearColor = BABYLON.Color3.Black();
    }

    setup() {

        console.log('Init Menu');

        // var element = document.querySelector("body");
        // element.classList.add("scanlines");


        this.camera = new BABYLON.FreeCamera("menuCamera", new BABYLON.Vector3(0, 3, -10), this.scene);

        this.camera.setTarget(BABYLON.Vector3.Zero());




        let sun = new BABYLON.PointLight("sunMenu", new BABYLON.Vector3(-7, 3, -7), this.scene);
        sun.diffuse = new BABYLON.Color3(1, 0.9, 0.9);
        sun.specular = new BABYLON.Color3(0, 0, 0);
        sun.intensity = 3;




        this.skybox = BABYLON.Mesh.CreateBox("skyBox", 20, this.scene);
        this.skybox.position = new BABYLON.Vector3(0, 0, 0);

        this.skyboxMaterial = new BABYLON.StandardMaterial("skyboxMaterial", this.scene);
        this.skyboxMaterial.backFaceCulling = false;
        // this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/space/space", this.scene);


        // var loadSpaceTexture = this.assetsManager.addTextureTask("loadSpaceTexture", "./assets/models/asteroids/asteroid_normalmap.jpg");


        // OS and Navigator Detection (Chrome/Mac Texture Limitation Bug)
        if (navigator.platform.indexOf('Mac') > -1 && navigator.userAgent.indexOf("Chrome") > -1) {
            console.log('Low-Res Skybox (macOS & Chrome');
            this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);
        } else {
            this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/space/space", this.scene);
        }

        // this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/stars", this.scene);

        this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.skybox.material = this.skyboxMaterial;

        if (config.skyBoxInfiniteDistance) {
            this.skybox.infiniteDistance = true;
            // this.skybox.renderingGroupId = 0;
        }

        this.planet = new Planet(this.scene, this.engine, this.assetsManager, "Menu");

        this.createLogo();

        window.onclick = () => {
            this.launchFullscreen();
        }
    }

    createLogo() {
        this.logo = document.createElement('h1');
        this.logo.setAttribute('class', 'logo');

        let content = `Antimatter`;

        this.logo.innerHTML = content;

        document.body.appendChild(this.logo);

        this.createStartText();
        this.createQualityOptions();
    }

    createStartText() {
        var n = document.createElement('p');
        n.setAttribute('class', 'startText');

        let content = `START GAME`;

        n.innerHTML = content;

        n.addEventListener("click", () => {
            this.fadeOut();
            this.fadeOutText(n);
            this.fadeOutText(this.logo);

            let ul = document.querySelector('ul');
            this.fadeOutText(ul);

            setTimeout(() => {
                var element = document.querySelector("body");
                element.classList.remove("scanlines");
                this.game.currentState = "Game";
                this.game.setup();
            }, 3000);
        });

        document.body.appendChild(n);

    }

    createQualityOptions() {
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'qualityOptions');
        ul.innerHTML = "Quality Settings:"

        var li1 = document.createElement('li');
        var li2 = document.createElement('li');

        li1.innerHTML = 'Automatic';
        li2.innerHTML = 'High';

        let qualitySettings = localStorage.getItem('qualitySettings');
		if(qualitySettings == undefined || qualitySettings == 'auto'){
			li1.setAttribute('class', 'qualityOptionsActive');
		} else if (qualitySettings == 'high'){
			li2.setAttribute('class', 'qualityOptionsActive');
		}

        ul.appendChild(li1);
        ul.appendChild(li2);

        li1.addEventListener("click", () => {
            li1.classList.add("qualityOptionsActive");
            li2.classList.remove("qualityOptionsActive");
            localStorage.setItem('qualitySettings', 'auto');
            window.location.reload();

        });

        li2.addEventListener("click", () => {
            li1.classList.remove("qualityOptionsActive");
            li2.classList.add("qualityOptionsActive");
            localStorage.setItem('qualitySettings', 'high');
            window.location.reload();

        });

        document.body.appendChild(ul);


    }

    fadeOutText(el) {
        el.style.opacity = 1;

        let fadeInterval = setInterval(() => {
            el.style.opacity -= 0.01;

            if (el.style.opacity <= 0) {
                clearInterval(fadeInterval);
            }
        }, 10);
    }

    fadeOut() {
        BABYLON.Effect.ShadersStore["fadePixelShader"] =
            "precision highp float;" +
            "varying vec2 vUV;" +
            "uniform sampler2D textureSampler; " +
            "uniform float fadeLevel; " +
            "void main(void){" +
            "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
            "baseColor.a = 1.0;" +
            "gl_FragColor = baseColor;" +
            "}";

        var fadeLevel = 1.0;
        var postProcess = new BABYLON.PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this.camera);
        postProcess.onApply = (effect) => {
            effect.setFloat("fadeLevel", fadeLevel);
        };

        var alpha = 1;
        this.scene.registerBeforeRender(function () {
            //fadeLevel = Math.abs(Math.cos(alpha));
            fadeLevel = (alpha <= 1 ? alpha : 0);;
            alpha -= 0.01;
        });
    }

    launchFullscreen() {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            return;
        }
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

}