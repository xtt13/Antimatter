import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

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

            n.innerHTML = "Year 2220: After the destruction of Earth, the last humans gather in a space station orbiting Mars. Fifty years ago, the last ark and hope of humanity left Mars heading to the solar system Proxima Centauri to settle on the planet Proxima Centauri B. A few years ago, the breakthrough came in the development of jump gates to other solar systems. Your job is to complete the planned jump gate in order to meet the ark at the final destination. This will also save all inhabitants of your space station and lead them into a new future.";

            document.body.appendChild(n);
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