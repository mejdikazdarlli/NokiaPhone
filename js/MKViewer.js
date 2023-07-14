import * as THREE from './THREE/three.module.js';
import { OrbitControls } from './THREE/OrbitControls.js';
import { RGBELoader } from './THREE/RGBELoader.js';
import { GLTFLoader } from './THREE/GLTFLoader.js';
import { DRACOLoader } from './THREE/DRACOLoader.js';

function _(elm) { return document.getElementById(elm) }
export class MKviewer {
    constructor(container, camera, scene, orbit, renderer,
        cameraScreenShotFaceCenter,
        cameraScreenShotFaceRight,
        cameraScreenShotFaceLeft,
        cameraScreenShotBackCenter)
        {
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.orbit = orbit;
        this.renderer = renderer;
        this.cameraScreenShotFaceCenter = cameraScreenShotFaceCenter;
        this.cameraScreenShotFaceRight = cameraScreenShotFaceRight;
        this.cameraScreenShotFaceLeft = cameraScreenShotFaceLeft;
        this.cameraScreenShotBackCenter = cameraScreenShotBackCenter;
        }
   async initScene() {
        this.scene = new THREE.Scene();
        this.scene.name = "MK-scene"
        // let fogColor = new THREE.Color(0xff0000);
        // this.scene.fog = new THREE.Fog(fogColor, 50, 70);
        //document.body.appendChild(container);
        const size = 100;
        const divisions = 20;
        const gridHelper = new THREE.GridHelper(size, divisions);
        //this.scene.add( gridHelper );
        const fov = 15;
        const near = 0.1;
        const far = 10000;
        this.camera = new THREE.PerspectiveCamera(fov, this.container.innerWidth / this.container.innerHeight, near, far);
        this.camera.name = "MK-camera"
        this.camera.position.set(5,10,5)
        this.camera.zoom = 1.0;
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.camera);
        //this.camera.layers.enable(1)

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.toneMappingExposure =1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.CustomToneMapping;
        THREE.ShaderChunk.tonemapping_pars_fragment = THREE.ShaderChunk.tonemapping_pars_fragment.replace(
            'vec3 CustomToneMapping( vec3 color ) { return color; }',
            `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 0.0;
            float contrast(float mValue, float mScale, float mMidPoint) {return clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);}
            float contrast(float mValue, float mScale) {return contrast(mValue,  mScale, .5);}
            vec3 contrast(vec3 mValue, float mScale, float mMidPoint) {return vec3( contrast(mValue.r, mScale, mMidPoint), contrast(mValue.g, mScale, mMidPoint), contrast(mValue.b, mScale, mMidPoint) );}
            vec3 contrast(vec3 mValue, float mScale) {return contrast(mValue, mScale, .5);}
            vec3 CustomToneMapping( vec3 color ) {
                    vec3 memcolor = color;
                    vec3 linear = toneMappingExposure * color;
                    const mat3 ACESInputMat = mat3(vec3( 0.59719, 0.07600, 0.02840 ),vec3( 0.35458, 0.90834, 0.13383 ),vec3( 0.04823, 0.01566, 0.83777 ));
                    const mat3 ACESOutputMat = mat3(vec3(  1.60475, -0.10208, -0.00327 ),vec3( -0.53108,  1.10813, -0.07276 ),vec3( -0.07367, -0.00605,  1.07602 ));
                    color *= toneMappingExposure / 1.0;
                    color = ACESInputMat * color;
                    // Apply RRT and ODT
                    color = RRTAndODTFit( color );
                    color = ACESOutputMat * color;
                    vec3 film =  color ;
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    gray = clamp(gray,0.0,1.0);
                    //return clamp(contrast((1.0-gray)*linear + gray*film,1.1,.0),0.0,1.0);
                    return (film+linear)*1.2;
                    //return clamp((1.0-gray)*linear + gray*film,0.0,1.0);
                    //return linear;
                    //return clamp(film,0.0,1.0);
            }`
    );
 
        await LoadModel('3310.glb', this.scene,this.renderer);
        await LoadWeapon('M4A4.glb',this.scene, this.camera,0.3,0,-0.1,-1);
        await loadEnvironmentHDR(this.renderer, this.scene, 'metal_02.hdr');
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbit.minDistance=60;
        // this.orbit.maxDistance=60;
        this.orbit.maxPolarAngle = Math.PI/1.1
        this.orbit.minPolarAngle = Math.PI/10
        this.orbit.target.set(0,0,0);
        this.orbit.autoRotate = false;
        this.orbit.autoRotateSpeed = 1.9;
        this.orbit.enablePan = true;
        this.orbit.screenSpacePanning = false;

        this.orbit.addEventListener('change', this.render.bind(this));

        window.addEventListener('resize', this.onWindowResize.bind(this), false);

    }
    animate() {
        delta += clock.getDelta();
        requestAnimationFrame(this.animate.bind(this));
        
        if (delta > interval) {
            if(LoadedModel) {this.orbit.update();}
            this.renderer.clear();
            this.render();
            delta = delta % interval;
        }
    }
    onWindowResize() {
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.render();
    }
    render() {this.renderer.render(this.scene, this.camera);}
}
export let LoadedModel = false
let interval = 1 / 25, delta = 0, clock = new THREE.Clock();
var loader = new GLTFLoader( FNmanager());
var loaderDRACO = new DRACOLoader();
loaderDRACO.setDecoderPath('./js/decoder/');
loader.setDRACOLoader(loaderDRACO);
export async function LoadModel(model, _thisScene) {
    _("loader_spiner").style.display = "block";
    return new Promise((resolve, reject) => {
        loader.load( 'asset/' + model,
        async function (object) {
            var SceneGLB = object.scene;
            SceneGLB.name = String(model)
            SceneGLB.traverse(async function (child) {
                // if(child.name==="numners")
                // {child.visible= false}
            })
            _thisScene.add(SceneGLB)
            LoadedModel = true
        resolve()
    }
        ,
        xhr => {
          console.log(`Loading Model :  ${Math.floor((xhr.loaded / xhr.total) * 100)}%`);
        },
        err => {
          reject(new Error(err));
        }
      );
    });
  }

export async function LoadWeapon(model,_thisScene, _thisCamera,vecScale,vecPositionX,vecPositionY,vecPositionZ) {
    _("loader_spiner").style.display = "block";

    return loader.load('asset/' + model, function (object) {
        var Weapon = object.scene;
        Weapon.name = String(model)
        Weapon.scale.set(vecScale,vecScale,vecScale)
        Weapon.traverse(async function (child) {
            if(child.name===model)
           { child.position.set(vecPositionX,vecPositionY,vecPositionZ)   // 0,-0.1,-1
            child.lookAt(new THREE.Vector3(0,0,0))}
        })
        _thisCamera.add(Weapon)
    })
}

export function FNmanager() {
    var manager = new THREE.LoadingManager();
    manager.onLoad = async function () { //console.log("loaded");
    _("loader_spiner").style.display = "none";
};
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        _("loader_spiner").style.display = "block";
        // let percentComplete = itemsLoaded / itemsTotal * 100;
        // _("loadertxt").innerText =Math.round( percentComplete, 2 )+'%';
        // console.log("chargement terminer : " + url, "--->", itemsLoaded, "/", itemsTotal);
    };
    manager.onError = function (url) {
        console.error("--->Erreur de chargement :--->");
        console.log(url);
    };
    return manager
}
async function loadEnvironmentHDR(renderer, scene, hdr) {
    var loaderhdr = new RGBELoader().setDataType(THREE.UnsignedByteType).setPath('./img/env/').load(hdr, function (texture) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        var envMap_hdr = pmremGenerator.fromEquirectangular(loaderhdr);
        pmremGenerator.compileEquirectangularShader();
        texture.dispose();
        pmremGenerator.dispose();
        scene.environment = envMap_hdr.texture;
        //scene.background = envMap_hdr.texture;
    });
}



