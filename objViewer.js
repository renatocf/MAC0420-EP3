var program_1;
var canvas_1;
var gl_1;

var program_2;
var canvas_2;
var gl_2;

var program_3;
var canvas_3;
var gl_3;

var pointsArray_1 = [
        vec4( -0.25, -0.25,  0.0, 1.0 ),
        vec4( -0.25,  0.25,  0.0, 1.0 ),
        vec4( 0.25,  0.25,  0.0, 1.0 ),
        vec4( 0.25, -0.25,  0.0, 1.0 )
	];

var pointsArray_2 = [
        vec4( -0.5, -0.5,  0.0, 1.0 ),
        vec4( -0.5,  0.5,  0.0, 1.0 ),
        vec4( 0.5,  0.5,  0.0, 1.0 ),
        vec4( 0.5, -0.5,  0.0, 1.0 )
	];

var pointsArray_3 = [];
var normalsArray_3 = [];

var vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];

var lightPosition = vec4( 10.0, 10.0, 10.0, 0.0 );
var lightAmbient = vec4( 0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

// camera definitions
var eye = vec3(1.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var cradius = 1.0;
var ctheta = 0.0;
var cphi = 0.0;

// our universe
var xleft = -1.0;
var xright = 1.0;
var ybottom = -1.0;
var ytop = 1.0;
var znear = -100.0;
var zfar = 100.0;

// transformation and projection matrices
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc_1, projectionMatrixLoc_1;
var modelViewMatrixLoc_2, projectionMatrixLoc_2;
var modelViewMatrixLoc_3, projectionMatrixLoc_3;

var grau_poli = 1;
var subdivisões = 1;
var desvio = 1;
var tipo_curva = 1; //default B-spline.

// generate a quadrilateral with triangles
function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = vec4(cross(t1, t2), 0);

     pointsArray_3.push(vertices[a]); 
     normalsArray_3.push(normal); 
     pointsArray_3.push(vertices[b]); 
     normalsArray_3.push(normal); 
     pointsArray_3.push(vertices[c]); 
     normalsArray_3.push(normal);   
     pointsArray_3.push(vertices[a]);  
     normalsArray_3.push(normal); 
     pointsArray_3.push(vertices[c]); 
     normalsArray_3.push(normal); 
     pointsArray_3.push(vertices[d]); 
     normalsArray_3.push(normal);    
}


// define faces of a cube
function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    canvas_1 = document.getElementById( "gl-canvas-1" );
    canvas_2 = document.getElementById( "gl-canvas-2" );
    canvas_3 = document.getElementById( "gl-canvas-3" );

    gl_1 = WebGLUtils.setupWebGL( canvas_1 );
    if ( !gl_1 ) { alert( "WebGL isn't available" ); }
    gl_2 = WebGLUtils.setupWebGL( canvas_2 );
    if ( !gl_2 ) { alert( "WebGL isn't available" ); }
    gl_3 = WebGLUtils.setupWebGL( canvas_3 );
    if ( !gl_3 ) { alert( "WebGL isn't available" ); }

    canvas_1.width = canvas_1.clientWidth;
    canvas_1.height = canvas_1.clientHeight;
    canvas_2.width = canvas_2.clientWidth;
    canvas_2.height = canvas_2.clientHeight;
    canvas_3.width = canvas_3.clientWidth;
    canvas_3.height = canvas_3.clientHeight;
    
    // create viewport and clear color
    gl_1.viewport( 0, 0, canvas_1.width, canvas_1.height );
    gl_1.clearColor( 0.5, 0.5, 0.5, 1.0 );
    // create viewport and clear color
    gl_2.viewport( 0, 0, canvas_2.width, canvas_2.height );
    gl_2.clearColor( 0.5, 0.5, 0.5, 1.0 );
    // create viewport and clear color
    gl_3.viewport( 0, 0, canvas_3.width, canvas_3.height );
    gl_3.clearColor( 0.5, 0.5, 0.5, 1.0 );

    // enable depth testing for hidden surface removal
    gl_1.enable(gl_1.DEPTH_TEST);
    // enable depth testing for hidden surface removal
    gl_2.enable(gl_2.DEPTH_TEST);
    // enable depth testing for hidden surface removal
    gl_3.enable(gl_3.DEPTH_TEST);

    //  load shaders and initialize attribute buffers
    program_1 = initShaders( gl_1, "vertex-shader-1", "fragment-shader-1" );
    gl_1.useProgram( program_1 );
    //  load shaders and initialize attribute buffers
    program_2 = initShaders( gl_2, "vertex-shader-2", "fragment-shader-2" );
    gl_2.useProgram( program_2 );
    //  load shaders and initialize attribute buffers
    program_3 = initShaders( gl_3, "vertex-shader-3", "fragment-shader-3" );
    gl_3.useProgram( program_3 );

    // draw simple cube for starters
    colorCube();

    // create light components
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    // create model view and projection matrices
    modelViewMatrixLoc_1 = gl_1.getUniformLocation(program_1, "modelViewMatrix");
    projectionMatrixLoc_1 = gl_1.getUniformLocation(program_1, "projectionMatrix");
    // create model view and projection matrices
    modelViewMatrixLoc_2 = gl_2.getUniformLocation(program_2, "modelViewMatrix");
    projectionMatrixLoc_2 = gl_2.getUniformLocation(program_2, "projectionMatrix");
    // create model view and projection matrices
    modelViewMatrixLoc_3 = gl_3.getUniformLocation(program_3, "modelViewMatrix");
    projectionMatrixLoc_3 = gl_3.getUniformLocation(program_3, "projectionMatrix");

    document.getElementById("clear").onclick = function() {
    	pointsArray_1 = [];
    	pointsArray_2 = [];
    	pointsArray_3 = [];
    	normalsArray_3 = [];
    };

    document.getElementById("ok_graup").onclick = function() {
        var g = document.getElementById("graup").value;
        grau_poli = parseInt(g);
        console.log("grau");
        console.log(grau_poli);   
    };

    document.getElementById("ok_subd").onclick = function() {
        var s = document.getElementById("subd").value;
        subdivisões = parseInt(s);
        console.log("subdivisões");
        console.log(subdivisões);
    }; 

    document.getElementById("ok_desvio").onclick = function() {
        var d = document.getElementById("desvio").value;
        desvio = parseFloat(d);
        console.log("desvio");
        console.log(desvio);
    };

    document.getElementById('rates').onclick = function () {
        var curva;
        var fr = document.getElementById('radios').getElementsByTagName('input');
        for (var i = 0; i < fr.length; ++i)
            if (fr[i].type == 'radio' && fr[i].checked)
                curva = fr[i].value;

        if (curva == "B-spline")
            tipo_curva = 1;
        else
            tipo_curva = 2;

        console.log("curva");
        console.log(curva);
        console.log(tipo_curva);
    };

    gl_3.uniform4fv(gl_3.getUniformLocation(program_3, "ambientProduct"),
       flatten(ambientProduct));
    gl_3.uniform4fv(gl_3.getUniformLocation(program_3, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl_3.uniform4fv(gl_3.getUniformLocation(program_3, "specularProduct"), 
       flatten(specularProduct) );	
    gl_3.uniform4fv(gl_3.getUniformLocation(program_3, "lightPosition"), 
       flatten(lightPosition) );       
    gl_3.uniform1f(gl_3.getUniformLocation(program_3, 
       "shininess"),materialShininess);

    render();
}

var render = function() {

    createBuffers();

    var wrapper = document.getElementById( "gl-wrapper" );
    var ratio = wrapper.clientHeight/wrapper.clientWidth;
            
    gl_1.clear( gl_1.COLOR_BUFFER_BIT | gl_1.DEPTH_BUFFER_BIT);
    gl_2.clear( gl_2.COLOR_BUFFER_BIT | gl_2.DEPTH_BUFFER_BIT);
    gl_3.clear( gl_3.COLOR_BUFFER_BIT | gl_3.DEPTH_BUFFER_BIT);
            
    eye = vec3(cradius * Math.sin(ctheta) * Math.cos(cphi),
               cradius * Math.sin(ctheta) * Math.sin(cphi), 
               cradius * Math.cos(ctheta));

    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, scaleM(vec3(ratio*3, 1, 1)));
    projectionMatrix = ortho(xleft, xright, ybottom, ytop, znear, zfar);

    gl_1.uniformMatrix4fv(modelViewMatrixLoc_1, false, flatten(modelViewMatrix));
    gl_1.uniformMatrix4fv(projectionMatrixLoc_1, false, flatten(projectionMatrix));
    gl_1.drawArrays( gl_1.POINTS, 0, pointsArray_1.length );

    gl_2.uniformMatrix4fv(modelViewMatrixLoc_2, false, flatten(modelViewMatrix));
    gl_2.uniformMatrix4fv(projectionMatrixLoc_2, false, flatten(projectionMatrix));
    gl_2.drawArrays( gl_2.POINTS, 0, pointsArray_2.length );

    gl_3.uniformMatrix4fv(modelViewMatrixLoc_3, false, flatten(modelViewMatrix));
    gl_3.uniformMatrix4fv(projectionMatrixLoc_3, false, flatten(projectionMatrix));
    gl_3.drawArrays( gl_3.TRIANGLES, 0, pointsArray_3.length );

    requestAnimFrame(render);
}


function createBuffers() {

    var vBuffer = gl_1.createBuffer();
    gl_1.bindBuffer( gl_1.ARRAY_BUFFER, vBuffer );
    gl_1.bufferData( gl_1.ARRAY_BUFFER, flatten(pointsArray_1), gl_1.STATIC_DRAW );
    
    var vPosition = gl_1.getAttribLocation(program_1, "vPosition");
    gl_1.vertexAttribPointer(vPosition, 4, gl_1.FLOAT, false, 0, 0);
    gl_1.enableVertexAttribArray(vPosition);

    var vBuffer = gl_2.createBuffer();
    gl_2.bindBuffer( gl_2.ARRAY_BUFFER, vBuffer );
    gl_2.bufferData( gl_2.ARRAY_BUFFER, flatten(pointsArray_2), gl_2.STATIC_DRAW );
    
    var vPosition = gl_2.getAttribLocation(program_2, "vPosition");
    gl_2.vertexAttribPointer(vPosition, 4, gl_2.FLOAT, false, 0, 0);
    gl_2.enableVertexAttribArray(vPosition);

    var nBuffer = gl_3.createBuffer();
    gl_3.bindBuffer( gl_3.ARRAY_BUFFER, nBuffer );
    gl_3.bufferData( gl_3.ARRAY_BUFFER, flatten(normalsArray_3), gl_3.STATIC_DRAW );
    
    var vNormal = gl_3.getAttribLocation( program_3, "vNormal" );
    gl_3.vertexAttribPointer( vNormal, 4, gl_3.FLOAT, false, 0, 0 );
    gl_3.enableVertexAttribArray( vNormal );

    var vBuffer = gl_3.createBuffer();
    gl_3.bindBuffer( gl_3.ARRAY_BUFFER, vBuffer );
    gl_3.bufferData( gl_3.ARRAY_BUFFER, flatten(pointsArray_3), gl_3.STATIC_DRAW );
    
    var vPosition = gl_3.getAttribLocation(program_3, "vPosition");
    gl_3.vertexAttribPointer(vPosition, 4, gl_3.FLOAT, false, 0, 0);
    gl_3.enableVertexAttribArray(vPosition);
}


