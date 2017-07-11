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

  /*var geometry = new THREE.SphereGeometry(0.51, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    map		: THREE.ImageUtils.loadTexture('images/CanvasDemo.png'),
    transparent: true,
    opacity		: 0.3});

  var alphaMap = new THREE.TextureLoader().load('images/CanvasDemo.png');
  material.alphaMap = alphaMap;
  material.alphaMap.magFilter = THREE.NearestFilter;
  material.alphaMap.wrapT = THREE.RepeatWrapping;
  material.alphaMap.repeat.y = 1;
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;*/
// execute this code every frame


  var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
  var material	= new THREE.MeshPhongMaterial({
    //map		: THREE.ImageUtils.loadTexture('images/CanvasDemo.png'),
    //side		: THREE.DoubleSide,
    transparent	: true,
    opacity		: 0.7,
  })

  var alphaMap = new THREE.TextureLoader().load('images/CanvasDemo.png');
  material.alphaMap = alphaMap;
  //material.alphaMap.magFilter = THREE.NearestFilter;
  material.alphaMap.wrapT = THREE.RepeatWrapping;
  material.alphaMap.wrapS = THREE.RepeatWrapping;
  material.alphaMap.repeat.x = 1;

  var mesh	= new THREE.Mesh(geometry, material)
  return mesh
}

var createScene = function(){

  createLights();
  createSpace();

  //create earth
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
var startTime = new Date().getTime();
camera.position.set(0,0,3);
camera.lookAt(new THREE.Vector3(0,0,0));

function render(){
  requestAnimationFrame(render);

  //rotate earth a little
  //earthObject.rotation.y += (0.05*(Math.PI / 180)) % 360;
  //rotate cloud a little

  if(cloudMesh){
    //cloudMesh.rotation.y += ((0.1*Math.PI / 180)) % 360;

    var time = new Date().getTime() - startTime;
    cloudMesh.material.alphaMap.offset.x = time*0.00015;
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(render);

