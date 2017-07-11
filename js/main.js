"use strict";

//init scene, camera(orbit), renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias:true});
var controls = new THREE.OrbitControls(camera);
var cloudMesh = null;

//init renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

var earthObject = new THREE.Object3D();
scene.add(earthObject);

var createLights = function(){
  var light	= new THREE.DirectionalLight( 0xcccccc, 0.6 );
  light.position.set(100,3,5);
  scene.add( light )

  var light	= new THREE.AmbientLight( 0x888888 )
  scene.add( light );
}

var createSpace = function(){
  var geometry  = new THREE.SphereGeometry(90, 32, 32)
  var material  = new THREE.MeshBasicMaterial()
  material.map   = THREE.ImageUtils.loadTexture('images/galaxy_starfield.png')
  material.side  = THREE.BackSide
  var mesh  = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

var createEarthCloud	= function(){
  // create destination canvas
  var canvasResult	= document.createElement('canvas')
  canvasResult.width	= 1024
  canvasResult.height	= 512
  var contextResult	= canvasResult.getContext('2d')

  // load earthcloudmap
  var imageMap	= new Image();
  imageMap.addEventListener("load", function() {

    // create dataMap ImageData for earthcloudmap
    var canvasMap	= document.createElement('canvas')
    canvasMap.width	= imageMap.width
    canvasMap.height= imageMap.height
    var contextMap	= canvasMap.getContext('2d')
    contextMap.drawImage(imageMap, 0, 0)
    var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

    // load earthcloudmaptrans
    var imageTrans	= new Image();
    imageTrans.addEventListener("load", function(){
      // create dataTrans ImageData for earthcloudmaptrans
      var canvasTrans		= document.createElement('canvas')
      canvasTrans.width	= imageTrans.width
      canvasTrans.height	= imageTrans.height
      var contextTrans	= canvasTrans.getContext('2d')
      contextTrans.drawImage(imageTrans, 0, 0)
      var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
      // merge dataMap + dataTrans into dataResult
      var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
      for(var y = 0, offset = 0; y < imageMap.height; y++){
        for(var x = 0; x < imageMap.width; x++, offset += 4){
          dataResult.data[offset+0]	= dataMap.data[offset+0]
          dataResult.data[offset+1]	= dataMap.data[offset+1]
          dataResult.data[offset+2]	= dataMap.data[offset+2]
          dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]
        }
      }
      // update texture with result
      contextResult.putImageData(dataResult,0,0)
      material.map.needsUpdate = true;

      function download() {
        var dt = contextResult.canvas.toDataURL();
        this.href = dt; //this may not work in the future..
      }
      document.getElementById('download').addEventListener('click', download, false);


    })
    imageTrans.src	= 'images/earthcloudmaptrans.jpg';
  }, false);
  imageMap.src	= 'images/earthcloudmap.jpg';

  var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
  var material	= new THREE.MeshPhongMaterial({
    map		: THREE.ImageUtils.loadTexture('images/CanvasDemo.png'),//new THREE.Texture(canvasResult),
    //side		: THREE.DoubleSide,
    transparent	: true,
    opacity		: 0.7,
  })
  var mesh	= new THREE.Mesh(geometry, material)
  return mesh
}

var createScene = function(){

  createLights();
  createSpace();

  var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
  var material	= new THREE.MeshPhongMaterial({
    map		: THREE.ImageUtils.loadTexture('images/earthmap1k.jpg'),
    bumpMap		: THREE.ImageUtils.loadTexture('images/earthbump1k.jpg'),
    bumpScale	: 0.02,
    specularMap	: THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
    specular	: new THREE.Color('grey'),
  })
  var mesh	= new THREE.Mesh(geometry, material)
  earthObject.add(mesh);

  cloudMesh = createEarthCloud();
  earthObject.add(cloudMesh);


}

createScene();

camera.position.set(0,0,3);
camera.lookAt(new THREE.Vector3(0,0,0));

function render(){
  requestAnimationFrame(render);

  earthObject.rotation.y += (0.1*(Math.PI / 180)) % 360;
  //moon.rotation.y += ((2*Math.PI / 180)) % 360;
  if(cloudMesh){
    cloudMesh.rotation.y += ((0.2*Math.PI / 180)) % 360;
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(render);

