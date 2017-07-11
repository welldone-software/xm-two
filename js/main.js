"use strict";

//init scene, camera(orbit), renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias:true});

var orbitCamera = new THREE.OrbitControls(camera);
orbitCamera.maxDistance = 40;
orbitCamera.minDistance = 1;
camera.position.set(0,0,3);
camera.lookAt(new THREE.Vector3(0,0,0));

window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


var cloudMesh = null;
var drawLines = false;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

var earthObject = new THREE.Object3D();
scene.add(earthObject);

var linesObject = new THREE.Object3D();
linesObject.scale.set(0.5,0.5,0.5);
scene.add(linesObject);

var createHud = function(){

  var button = document.createElement( 'div' );
  button.id = 'button';
  button.textContent = 'ShowLines';
  button.addEventListener( 'click', function ( event ) {

    drawLines = !drawLines;
    button.textContent = drawLines ? 'HideLines' : 'ShowLines';

  }, false );

  document.body.appendChild( button );

  var text = document.createElement( 'div' );
  text.id = 'info';
  text.textContent = 'Drag - rotate around earth Scroll - zoom';

  document.body.appendChild( text );
}

var createLights = function(){
  var light	= new THREE.DirectionalLight( 0xaaaaaa, 1.0 );
  light.position.set(5,3,5);
  scene.add( light );

  var light	= new THREE.AmbientLight( 0xaaaaaa );
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
  var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
  var material	= new THREE.MeshPhongMaterial({
    map		: THREE.ImageUtils.loadTexture('images/CanvasDemo.png'),
    //side		: THREE.DoubleSide,
    transparent	: true,
    opacity		: 0.7,
  })
  var mesh	= new THREE.Mesh(geometry, material)
  return mesh
}

function randomSpherePoint(x0,y0,z0,radius){
  var u = Math.random();
  var v = Math.random();
  var theta = 2 * Math.PI * u;
  var phi = Math.acos(2 * v - 1);
  var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
  var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
  var z = z0 + (radius * Math.cos(phi));
  return [x,y,z];
}

var createLines = function(){
  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  for(var i = 0; i< 30; i++){
      var geometry = new THREE.Geometry();
      var pos = randomSpherePoint(0,0,0,0.7);
      geometry.vertices.push(
        new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( pos[0], pos[1], pos[2] )
      );

      var line = new THREE.Line( geometry, material );
      linesObject.add( line );
  }

  earthObject.add(linesObject);

}

var createScene = function(){

  createHud();
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

  createLines();
}

function render(){
  requestAnimationFrame(render);

  //rotate earth a little
  earthObject.rotation.y += (0.05*(Math.PI / 180)) % 360;
  //rotate cloud a little
  if(cloudMesh){
    cloudMesh.rotation.y += ((0.1*Math.PI / 180)) % 360;
  }

  if( drawLines && linesObject.scale.y < 1 ){
    var newScale = linesObject.scale.y + 0.02;
    linesObject.scale.set(newScale,newScale,newScale);
  }else if( !drawLines && linesObject.scale.y > 0.5 ){
    var newScale = linesObject.scale.y - 0.02;
    linesObject.scale.set(newScale,newScale,newScale);
  }

  renderer.render(scene, camera);
}

createScene();
requestAnimationFrame(render);

