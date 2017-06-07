var gl;
var shaders = {
  "shader-fs":
  "precision mediump float;" +
  "varying highp vec2 vTextureCoord;" +

  "uniform sampler2D uSampler;" +
  "void main(void) {" +
  //" gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +
  " gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));" +
  "}",

  "shader-vs":  "attribute vec3 aVertexPosition;" +
                "attribute vec2 aTextureCoord;" +

                "uniform mat4 uMVMatrix;" +
                "uniform mat4 uPMatrix;" +

    "varying highp vec2 vTextureCoord;" +

                "void main(void) {" +
                "   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
                "   vTextureCoord = aTextureCoord;" +
                "}"
};

var fpsDiv;
var myTexture;

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function getShader(gl, id) {
  /*var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }*/
  var str = shaders[id];
  /*var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }*/
  var shader;
  if (id == "shader-fs") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (id == "shader-vs") {
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
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

  shaderProgram.textureCoordsAttribute=gl.getAttribLocation(shaderProgram,"aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordsAttribute);

  shaderProgram.samplerUniform=gl.getUniformLocation(shaderProgram,"uSampler");
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var squareVertexPositionBuffer;
var texCoordBuffer;

function initBuffers() {
  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  vertices = [
    1.0,  1.0,  0.0,
    -1.0,  1.0,  0.0,
    1.0, -1.0,  0.0,
    -1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  var texCoordLocation = gl.getAttribLocation(shaderProgram, "aTextureCoord");

  // provide texture coordinates for the rectangle.
  texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0]), gl.STATIC_DRAW);

  texCoordBuffer.itemSize = 2;

}

var myTexture;
var cubeImage;

function initTextures() {
  myTexture = gl.createTexture();
  cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, myTexture); }
  cubeImage.src = 'network-big.png';
}

function handleTextureLoaded(image, texture) {

  console.log("handleTextureLoaded");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  /*gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);*/

  gl.bindTexture(gl.TEXTURE_2D, null);
}

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  for(var i = 0; i < 50; i++) {
    for (var j = 0; j < 50; j++) {
      mat4.identity(mvMatrix);
      mat4.translate(mvMatrix, [-140 + i * 3 + xOffset, -40 + j * 3, -100.0 + zOffset]);

      //mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
      gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.vertexAttribPointer(shaderProgram.textureCoordsAttribute, texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,myTexture);
      gl.uniform1i(shaderProgram.samplerUniform,0);

      setMatrixUniforms();

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    }
  }
}

var lastRun = new Date().getTime();
var drawDelayTimer = 0;
var zOffset = 0;
var xOffset = 0;
var yOffset = 0;
function drawFPS(){

  var delta = (new Date().getTime() - lastRun)/1000;
  lastRun = new Date().getTime();
  var fps = 1/delta;

  drawDelayTimer -= delta;
  if(drawDelayTimer < 0) {
    drawDelayTimer = 1;
    //console.log("fps", fps);
    if(!fpsDiv){
      fpsDiv = document.getElementById("fps");
    }

    fpsDiv.innerText = "FPS:" + parseInt(fps);
  }
}
function renderloop(){
  window.requestAnimationFrame(renderloop);
  drawScene();
  drawFPS();
};

function webGLStart() {
  var canvas = document.getElementById("canvas-elm");
  initGL(canvas);
  initShaders();
  initBuffers();
  initTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  document.getElementById("canvas-elm").addEventListener("mousemove", function(e){
    zOffset = e.offsetY / 500 * 100;
    xOffset = e.offsetX / 500 * 100;
    //console.log(e.offsetY);
  });

  document.getElementById("canvas-elm").addEventListener("keydown", function(ev){

  }, true);

  renderloop();
}
