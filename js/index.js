import { MKviewer,LoadWeapon} from './MKViewer.js';
import {ScreenShake } from './ScreenShake.js'
import * as THREE from './THREE/three.module.js';
import { TWEEN } from './THREE/tween.module.min.js';
function _(elm) { return document.getElementById(elm) }
let Viewer = new MKviewer(_("MKViewer"))
Viewer.initScene()
Viewer.animate()
Viewer.render = function () {
    screenShake.update(Viewer.camera);
    TWEEN.update()
    Viewer.renderer.render(Viewer.scene, Viewer.camera);
}
var raycaster, mouse = { x: 0, y: 0 };
raycaster = new THREE.Raycaster();
var intersects = [];
let startX;
let startY;
const delta = 1.5;
let isMobile = false;
let firstTouch = true;
let isSwiping = false;
let TWEEN_DURATION = 200
var screenShake = ScreenShake();
let defaultGun = "M4A4"
let soundurl = "sound/"+defaultGun+".mp3"
let code = [];
let winnerCode = "0 0 0 0"
let winnermsg = ":) Congratulation you are winner"
let losermsg = ":( try again"
if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent,
    )
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substring(0, 4),
    )
) {
    isMobile = true;
}

//pointer event works better than touch event
_("MKViewer").style.touchAction = 'none';
if (isMobile) {
    _("MKViewer").onpointerdown = function (event) {
        firstTouch = true;
        startX = event.pageX;
        startY = event.pageY;
        isSwiping = false;
    }
    _("MKViewer").onpointermove = function (event) {
        if (firstTouch) {
            startX = event.pageX;
            startY = event.pageY;
            firstTouch = false;
        } else {
            const diffX = Math.abs(event.pageX - startX);
            const diffY = Math.abs(event.pageY - startY);
            if (diffX < delta && diffY < delta && sogliaMove > 2) {
                // sogliaMove>2 means 2 frame still when isSwiping is true
                onDocumentTouchClick(event); // for iOS  
            }
        }
        isSwiping = true;
    }
    _("MKViewer").onpointerup =async function (event) {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
        if (diffX < delta && diffY < delta) {
            await onDocumentMouseClick(event); // Android old: is better desktop solution
        }
        firstTouch = true;
    }
}
else {
    //desktop behavior
    _("MKViewer").onpointerdown = (event) => {
        isSwiping = false;
        startX = event.pageX;
        startY = event.pageY;
    }
 _("MKViewer").onpointermove = (event) => {onDocumentMouseMove(event); isSwiping = true; }
    _("MKViewer").onpointerup = async(event) => {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
        if (diffX < delta && diffY < delta) {await onDocumentMouseClick(event); }
    }
    _("MKViewer").addEventListener("contextmenu", e => e.preventDefault());
}

const target = document.getElementById("target");
function onDocumentMouseMove(event) {
    target.style.left = event.clientX + "px",
    target.style.top = event.clientY + "px";
    Viewer.scene.updateMatrixWorld();
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true)
    if (intersects.length > 0)
        {
        if (intersects[0].object.name.startsWith("btn"))
            {
                _("MKViewer").style.cursor="pointer"
                target.style.display="none"
            }else
            {
                _("MKViewer").style.cursor="none"
                target.style.display="block"
                if(intersects[0].object.name==="glass-ext" || intersects[0].object.name==="3310" )
                {
                    target.src = 'img/targetRed.png'
                }
                else
                {
                    target.src = 'img/target.png'
                }
            }
        }
        // Convert normalized device coordinates to world coordinates
        const mouseWorld = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(Viewer.camera);
        const cameraPosition = Viewer.camera.position.clone();
        const scalar = 200; // Adjust the scalar value as needed
        const direction = cameraPosition.sub(mouseWorld).normalize().multiplyScalar(scalar);
        //const direction = mouseWorld.sub(Viewer.camera.position).normalize();
        let Weapon = Viewer.scene.getObjectByName(defaultGun)
        const oppositeDirection = direction.negate();
        Weapon.lookAt(oppositeDirection);
}
async function onDocumentTouchClick(event) {
    //event.preventDefault();
    Viewer.scene.updateMatrixWorld();
    const rect = Viewer.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, Viewer.camera);
    intersects = raycaster.intersectObjects(Viewer.scene.children, true)
    if (intersects.length > 0) {
        if (intersects[0].object.name.startsWith("btn")) {
            btnPressed ()
        }
    }
  }

async function onDocumentMouseClick(event) {
    //event.preventDefault();
    if (!isSwiping) {
        Viewer.scene.updateMatrixWorld();
        const rect = Viewer.renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
        raycaster.setFromCamera(mouse, Viewer.camera);
        intersects = raycaster.intersectObjects(Viewer.scene.children, true)
        if (intersects.length > 0) {
            if(intersects[0].object.name==="glass-ext" || intersects[0].object.name==="3310" )
                {
                    console.log(soundurl)
                    const soundEffect = new Audio(soundurl);
                    screenShake.shake( Viewer.camera, new THREE.Vector3(0.03,-0.03,0.03), 150 );
                    soundEffect.play();
                }
            if (intersects[0].object.name.startsWith("btn")) {
                btnPressed ()
                let num = intersects[0].object.name.split("_")[1]
                code.push(num)
                if(code.length<5)
                {
                    document.querySelector(".code").children[0].innerHTML = code.join(' ')
                }
                else
                {
                    if(document.querySelector(".code").children[0].innerHTML ==winnerCode)
                    {
                        document.querySelector(".code").children[0].innerHTML = winnermsg
                    }
                    else
                    {
                        document.querySelector(".code").children[0].innerHTML = losermsg
                    }
                    code = []
                }
                //var screenNumbers = Viewer.scene.getObjectByName("numners", true);
                //screenNumbers.visible = true
                //let num = intersects[0].object.name.split("_")[1]
                //screenNumbers.material.map = numbers(num,"bold","normal",500,"Arial",'white','black')
                // screenNumbers.material.alphaMap = numbers(num,"bold","normal",500,"Arial",'white','black')
                // screenNumbers.material.transparent = true          
            }
        }
    }
    isSwiping = false;
}
function btnPressed ()
{
    const soundEffect = new Audio('sound/beep.mp3');
    soundEffect.play();
    let btn = intersects[0].object
    new TWEEN.Tween(btn.position)
    .to({y:btn.position.y-0.01 } , TWEEN_DURATION)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function(){})
    .onComplete(function(){
        new TWEEN.Tween(btn.position)
        .to({y:btn.position.y+0.01 } , TWEEN_DURATION)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
    })
    .start();
}
function numbers(text,weight,style,numbersize,numberfamily,col1,col2) {
    let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let width = 2048, height = 2048;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#000000';
      ctx.textAlign ="center";
      ctx.letterSpacing  ="1px";
      ctx.textBaseline = "middle";
      ctx.font =weight+" "+style+" " + numbersize + "px " + numberfamily;
      ctx.direction = "ltr" ;//"ltr" changer "rtl" pour l'arabe
      ctx.fillStyle = col1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = col2;
      ctx.fillText(text,1024,1024)
      const texture = new THREE.CanvasTexture(ctx.canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.flipY = false
      return texture; // Return the texture and the width of the text
    
}
let guns =document.querySelectorAll(".gun") 
guns.forEach(gun => {
    gun.onpointerup = async function()
    {
        let gunName =this.dataset.gun
        defaultGun = gunName
        let scl = this.dataset.scale
        let Xpos = this.dataset.posx
        let Ypos = this.dataset.posy
        let Zpos = this.dataset.posz
       await removeGun(gunName)
       await LoadWeapon(gunName+'.glb',Viewer.scene, Viewer.camera,scl,Xpos,Ypos,Zpos)
    } 
});
async function removeGun()
{
    const object = Viewer.camera.children[0];
    Viewer.camera.remove( object );
    //object.geometry.dispose();
    //object.material.dispose();
}


