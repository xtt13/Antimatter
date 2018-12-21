import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { toUnicode } from 'punycode';

export default class {
    constructor(scene, camera, asteroids) {
        this.scene = scene;
        this.camera = camera;
        this.asteroids = asteroids.asteroids;

        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
        this.labels = [];

        // Show Textbox
        // this.createUIBackground();
    }

    markAsteroids() {
        for (let i = 0; i < this.asteroids.length; i++) {
            this.createLabel(this.asteroids[i]);
            
        }

    }

    createUIBackground(){
        var n = document.createElement('div');
            n.setAttribute('class', 'scanlines ui-block');
            // n.setAttribute('style',
            //     'position:absolute;' +
            //     'display:block;' +
            //     'bottom: 0px;' +
            //     'left: 200px;' +
            //     'z-index:10001;' +
            //     'width: 200px;' +
            //     'height: 100px;' + 
            //     'font-family:Arial, Helvetica, sans-serif;' +
            //     'pointer-events:none;' +
            //     'color: black;' +
            //     'font-size: 12px;' +
            //     'padding: 10px;' +
            //     'background-color: red;');

            let content = `Hello, I'm your bord computer! In your mission you'll have to mine all relevant asteroids in this orbit. You'll find the necessary informations in your log by pressing the Tab-Key. It's probably the best idea to start with a orbit scan.

            You can either control your ship by pressing the W, A, S, D keys, or with a XBOX360 controller.
            Change your view by pressing the Key Number 1, or 2.`;


            let boardIntro = new BABYLON.Sound("bordintro", "assets/audio/sound/bordintro.mp3", this.scene, null,
            {
                playbackRate: 1,
                volume: 1,
                loop: false,
                autoplay: true
            })

            n.innerHTML = '';

            document.body.appendChild(n);

            let counter = 0;
            let uibox = document.querySelector('.scanlines');

            // Interval for Key by Key
            let textInterval = setInterval(() => {
                uibox.textContent += `${content[counter]}`;
                counter++;
                if(counter > (content.length - 1)){
                    clearInterval(textInterval);
                    setTimeout(() => {
                        n.style.display = 'none';
                    }, 3000);
                } 
            }, 50);

            
    }

    

    createLabel(mesh){
        // console.log(mesh.label);
        var label = new GUI.Rectangle("label for " + mesh.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.5;
        label.width = "130px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        this.advancedTexture.addControl(label); 
        label.linkWithMesh(mesh);

        var text1 = new GUI.TextBlock();
        text1.text = mesh.name;
        text1.color = "white";
        label.addControl(text1);  
        this.labels.push(label);
    }

    calculateViewport(){
        
    }





}