import * as BABYLON from 'babylonjs';
import Planet from './Planet';
import config from './config';

export default class {
    constructor(engine, canvas, assetsManager, game) {

        this.assetsManager = assetsManager;
        this.engine = engine;
        this.canvas = canvas;
        this.game = game;

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
            this.skybox.renderingGroupId = 0;
        }

        this.planet = new Planet(this.scene, this.engine, this.assetsManager, "Menu");

        this.createLogo();
        // this.initGlitchEffect();

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

            setTimeout(() => {
                var element = document.querySelector("body");
                element.classList.remove("scanlines");
                this.game.currentState = "Game";
                this.game.setup();
            }, 3000);
        });

        document.body.appendChild(n);


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

    initGlitchEffect() {
        let rgbGlitchFX =
            `varying vec2 vUV;
            uniform sampler2D textureSampler;
            uniform vec2 screenSize;
                
            uniform sampler2D noiseRef0;
            uniform sampler2D noiseRef1;
                
            uniform float time; 
                
            #define AMPLITUDE 0.05
            #define SPEED 10.0
                
            vec4 rgbShift( in vec2 p , in vec4 shift) {
                shift *= 2.0*shift.w - 1.0;
                vec2 rs = vec2(shift.x,-shift.y);
                vec2 gs = vec2(shift.y,-shift.z);
                vec2 bs = vec2(shift.z,-shift.x);    
                float r = texture2D(textureSampler, p+rs, 0.0).x;
                float g = texture2D(textureSampler, p+gs, 0.0).y;
                float b = texture2D(textureSampler, p+bs, 0.0).z;
                return vec4(r,g,b,1.0);
            }
            vec4 noise( in vec2 p ) {
                return texture2D(noiseRef0, p, 0.0);
            }
            
            vec4 vec4pow( in vec4 v, in float p ) {
                return vec4(pow(v.x,p),pow(v.y,p),pow(v.z,p),v.w); 
            }
            void main(void){ 
                vec2 p = vUV;
                vec4 c = vec4(0.0,0.0,0.0,1.0);
                vec4 shift = vec4pow(noise(vec2(SPEED*time,2.0*SPEED*time/25.0 )),8.0)
                            *vec4(AMPLITUDE,AMPLITUDE,AMPLITUDE,1.0);
                c += rgbShift(p, shift);
                gl_FragColor = c;
            }
        `;
        BABYLON.Effect.ShadersStore['rgbGlitchEffectFragmentShader'] = rgbGlitchFX;

        var time = 0;
        var rate = 0.05;

        // Move the light with the camera
        this.scene.registerBeforeRender(() => {
            time += this.scene.getAnimationRatio() * rate;
        });

        var postEffect = new BABYLON.PostProcess("rgbGlitchEffect", "rgbGlitchEffect", ["time", "screenSize"], ["noiseRef0", "noiseRef1"], 1, this.camera);

        var noiseTexture0 = new BABYLON.Texture('./assets/textures/glitch/grass.jpg', this.scene);
        var noiseTexture1 = new BABYLON.Texture('./assets/textures/glitch/ground.jpg', this.scene);

        postEffect.onApply = function (effect) {
            effect.setVector2("screenSize", new BABYLON.Vector2(postEffect.width, postEffect.height));
            effect.setFloat('time', time); //this is the problematic line
            effect.setTexture('noiseRef0', noiseTexture0);
            effect.setTexture('noiseRef1', noiseTexture1);
        };
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