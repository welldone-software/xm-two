//@flow
import React, {Component} from 'react'
import Two from 'two.js'
import Svg from './Svg'
import {clusterPkgsFromNodes} from '../utils/clustering'
import nodes from '../data/nodes4.json'

// const Chart = ({children}) => (
//   <div>
//     Chart
//     <div>{children}</div>
//   </div>
// )

var fpsText;
/*
<script id="shader-fs" type="x-shader/x-fragment">
  precision mediump float;
  varying vec2 vPosition;
  void main(void) {
  float cx = vPosition.x;
    float cy = vPosition.y;
    float hue;
    float saturation;
    float value;
    float hueRound;
    int hueIndex;
    float f;
    float p;
    float q;
    float t;
    float x = 0.0;
    float y = 0.0;
    float tempX = 0.0;
    int i = 0;
    int runaway = 0;
    for (int i=0; i < 100; i++) {
  tempX = x * x - y * y + float(cx);
      y = 2.0 * x * y + float(cy);
      x = tempX;
      if (runaway == 0 && x * x + y * y > 100.0) {
  runaway = i;
      }
    }
    if (runaway != 0) {
  hue = float(runaway) / 200.0;
      saturation = 0.6;
      value = 1.0;
      hueRound = hue * 6.0;
      hueIndex = int(mod(float(int(hueRound)), 6.0));
      f = fract(hueRound);
      p = value * (1.0 - saturation);
      q = value * (1.0 - f * saturation);
      t = value * (1.0 - (1.0 - f) * saturation);
      if (hueIndex == 0)
        gl_FragColor = vec4(value, t, p, 1.0);
      else if (hueIndex == 1)
        gl_FragColor = vec4(q, value, p, 1.0);
      else if (hueIndex == 2)
        gl_FragColor = vec4(p, value, t, 1.0);
      else if (hueIndex == 3)
        gl_FragColor = vec4(p, q, value, 1.0);
      else if (hueIndex == 4)
        gl_FragColor = vec4(t, p, value, 1.0);
      else if (hueIndex == 5)
        gl_FragColor = vec4(value, p, q, 1.0);
    } else {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }
</script>

<script id="shader-vs" type="x-shader/x-vertex">
  attribute vec2 aVertexPosition;
attribute vec2 aPlotPosition;
varying vec2 vPosition;
void main(void) {
  gl_Position = vec4(aVertexPosition, 1.0, 1.0);
  vPosition = aPlotPosition;
}
</script>


<script type="text/javascript">
  var gl;

  function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
  return null;
}
var str = "";
var k = shaderScript.firstChild;
while (k) {
  if (k.nodeType == 3) {
  str += k.textContent;
      }
      k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
  shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
  shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
  return null;
}
gl.shaderSource(shader, str);
gl.compileShader(shader);
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  alert(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }
  var shaderProgram;
  var aVertexPosition;
  function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(aVertexPosition);
    aPlotPosition = gl.getAttribLocation(shaderProgram, "aPlotPosition");
    gl.enableVertexAttribArray(aPlotPosition);
  }
  var centerOffsetX = 0;
  var centerOffsetY = 0;
  var zoom;
  var zoomCenterX;
  var zoomCenterY;
  var vertexPositionBuffer;
  function initBuffers() {
  vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertices = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 2;
    vertexPositionBuffer.numItems = 4;
  }
  var baseCorners = [
      [ 0.7,  1.2],
      [-2.2,  1.2],
      [ 0.7, -1.2],
      [-2.2, -1.2],
  ];
  function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(aVertexPosition, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    var plotPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, plotPositionBuffer);
    var cornerIx;
    corners = [];
    for (cornerIx in baseCorners) {
  x = baseCorners[cornerIx][0];
      y = baseCorners[cornerIx][1];
      corners.push(x / zoom + centerOffsetX);
      corners.push(y / zoom + centerOffsetY);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPlotPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.deleteBuffer(plotPositionBuffer)
    zoom *= 1.02;
    document.getElementById("zoomOutput").value = zoom;
    if (centerOffsetX != zoomCenterX) {
  centerOffsetX += (zoomCenterX - centerOffsetX) / 20;
    }
    document.getElementById("centerOffsetXOutput").value = centerOffsetX;
    if (centerOffsetY != zoomCenterY) {
  centerOffsetY += (zoomCenterY - centerOffsetY) / 20;
    }
    document.getElementById("centerOffsetYOutput").value = centerOffsetY;
  }
  function resetZoom() {
  zoom = 1.0;
    zoomCenterX = parseFloat(document.getElementById("zoomCenterXInput").value);
    zoomCenterY = parseFloat(document.getElementById("zoomCenterYInput").value);
  }
  function webGLStart() {
  resetZoom();
    var canvas = document.getElementById("example01-canvas");
    initGL(canvas);
    initShaders()
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    setInterval(drawScene, 15);
  }*/

class Chart extends Component {
  gl: any
  componentDidMount() {
    this.initGL(this.refs.canvas);
  }
  drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
  }
  initGL(canvas) {
    try {
      this.gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
      return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  }
  render() {
    return (
      <canvas ref="canvas" width={300} height={300}/>
    );
  }
}

export default Chart

/*
 class Chart extends Component{
 el: HTMLElement
 two: any

 drawFps(){
 fpsText = this.two.makeText("lalala", 100, 10);

 var lastRun = new Date().getTime();
 var drawDelayTimer = 0;
 this.two.bind('update', (frameCount) => {

 var delta = (new Date().getTime() - lastRun)/1000;
 lastRun = new Date().getTime();
 var fps = 1/delta;

 drawDelayTimer -= delta;
 if(drawDelayTimer < 0){
 drawDelayTimer = 1;
 //console.log("fps", fps);
 fpsText.value = parseInt(fps).toString();
 }
 }).play();

 }
 onRef = (el:HTMLElement) => {
 this.el = el
 const two = new Two({
 autostart: true,
 type: Two.Types.webgl
 })
 this.two = two
 var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);

 var img = document.createElement('img');
 img.onload = function() {
 var sprite = two.makeRectangle(100, 200, 50, 50);
 sprite.image = img;
 sprite.width = sprite.height = 50;
 };
 img.src = 'image.png';

 const device = two.interpret(el.parentElement.querySelector('.svg-device svg')).center()
 const network = two.interpret(el.parentElement.querySelector('.svg-network svg')).center()
 const data = two.interpret(el.parentElement.querySelector('.svg-data svg')).center()
 //console.log(svg)

 for(let i=0; i<1000; i++) {
 const g1 = device.clone()
 g1.fill = 'green'
 g1.opacity= 1;
 g1.translation.set(two.width / 2, i)
 g1.scale = 2

 const g2 = network.clone()
 g2.fill = 'yellow'
 g2.opacity= 1;
 g2.translation.set(i, two.height / 2)
 g2.scale = 2

 const g3 = data.clone()
 g3.fill = 'red'
 g3.opacity= 1;
 g3.translation.set(two.width / 2 + i, two.height / 2 + i)
 g3.scale = 2
 }

 this.drawFps();

 const clusters = clusterPkgsFromNodes(nodes)

 console.log(clusters)

 // clusters.items.forEach(c => {
 //   const r = two.makeRectangle(
 //     0,
 //     0,
 //     c.width,
 //     c.height)
 //
 //   console.log(c.x, c.y)
 //
 //   r.translation.set(c.x, c.y)
 //   r.fill = 'blue'
 //   r.stroke = 'red'
 //   //r.scale = 0.5
 // })
 // two.bind('update', function() {
 //   rect.rotation += 0.021;
 //   //g.rotation += 0.021;
 // });

 two.update()

 //two.scale = 4
 two.appendTo(el)
 }


 render(){
 return (<div>
 <div style={{position: 'absolute'}}>
 <Svg className="svg-data" name="map/data"/>
 <Svg className="svg-network" name="map/network"/>
 <Svg className="svg-device" name="map/device"/>
 </div>
 <div style={{border: 'solid 1px red', width: 1000, height: 1000}} ref={this.onRef}></div></div>)
 }
 }

 export default Chart
 */
