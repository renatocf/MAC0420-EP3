var program_1;
var canvas_1;
var gl_1;

var program_2;
var canvas_2;
var gl_2;

var program_3;
var canvas_3;
var gl_3;

var closedCurve;

var pointsArray_1 = [];
var pointsCurve_1 = [];
var pointsCtrl_1 = [
    vec4( -0.25, -0.25,  0.0, 1.0 ),
    vec4( -0.25,  0.25,  0.0, 1.0 ),
    vec4( 0.25,  0.25,  0.0, 1.0 ),
    vec4( 0.25, -0.25,  0.0, 1.0 )
];

var openCurve;

var pointsArray_2 = [];
var pointsCurve_2 = [];
var pointsCtrl_2 = [
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

var color_blue = vec4( 0.5, 0.7, 1.0, 1.0 );
var color_white = vec4( 0.7, 0.7, 0.7, 1.0 );
var color_darkblue = vec4( 0.0, 0.2, 0.8, 1.0 );
var color_green = vec4( 0.4, 1.0, 0.4, 1.0 );
var color_darkgreen = vec4( 0.0, 0.8, 0.0, 1.0 );

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

// Matriz de rotação do objeto 3D.
var rotationMatrix = mat4(1);
var rotationMatrixLoc;
// Centroide e raio da trackball que envolve o objeto 3D.
var centroid;
var radius;

var degree = 3; // default value.
var num_subdivisions = 50; // default value.
var std_deviation = 1; // default value.
var curve_type = 1; //default B-spline.

var lastcanX;
var lastcanY;

var mousedown1 = false;
var mousedown2 = false;
var mousedown3 = false;
var mousemove1 = false;
var mousemove2 = false;
var indice_ponto_1;
var indice_ponto_2;



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

    // create rotation matrix
    rotationMatrixLoc = gl_3.getUniformLocation(program_3, "rotationMatrix");

    document.getElementById("clear").onclick = function() {
    	pointsCtrl_1 = [];
        pointsArray_1 = [];
    	pointsCtrl_2 = [];
        pointsArray_2 = [];
    	pointsArray_3 = [];
    	normalsArray_3 = [];
        rotationMatrix = mat4(1);
    };

    document.getElementById("ok_degree").onclick = function() {
        degree = parseInt(document.getElementById("degree").value);
        update_curves();
    };

    document.getElementById("ok_num_subdivisions").onclick = function() {
        num_subdivisions = parseInt(document.getElementById("num_subdivisions").value);
        update_curves();
    };

    document.getElementById("ok_std_deviation").onclick = function() {
        std_deviation = parseFloat(document.getElementById("std_deviation").value);
        update_curves();
    };

    document.getElementById('rates').onclick = function () {
        var curve;
        var fr = document.getElementById('radios').getElementsByTagName('input');
        for (var i = 0; i < fr.length; ++i)
            if (fr[i].type == 'radio' && fr[i].checked)
                curve = fr[i].value;

        if (curve == "B-spline") curve_type = 1;
        else curve_type = 2;

        update_curves();
    };

    canvas_1.onmousedown = function (evt) {
        var X = evt.clientX;
        var Y = evt.clientY;
        var rst = viewportToCanonicalCoordinates(X, Y, canvas_1, 1);
        var canX = rst[0];
        var canY = rst[1];

        switch (evt.which) {
            case 1:
                mousedown1 = true;
                indice_ponto_1 = pontoClicado(canX, canY, 1);
        }
    };

    canvas_2.onmousedown = function (evt) {
        var X = evt.clientX;
        var Y = evt.clientY;
        var rst = viewportToCanonicalCoordinates(X, Y, canvas_2, 2);
        var canX = rst[0];
        var canY = rst[1];

        switch (evt.which) {
            case 1:
                mousedown2 = true;
                indice_ponto_2 = pontoClicado(canX, canY, 2);
        }
    };

    canvas_3.onmousedown = function (evt) {
        var X = evt.clientX;
        var Y = evt.clientY;
        var rst = viewportToCanonicalCoordinates(X, Y, canvas_3, 3);
        lastcanX = rst[0];
        lastcanY = rst[1];

        switch (evt.which) {
            case 1:
                mousedown3 = true;
                var rsp = boundingSphereRadiusCenter(pointsArray_3);
                radius = rsp[0];
                centroid = rsp[1];
        }
    };

    canvas_1.onmousemove = function (evt) {
        var actualX = evt.clientX;
        var actualY = evt.clientY;
        var rst = viewportToCanonicalCoordinates(actualX, actualY, canvas_1, 1);
        var actualcanX = rst[0];
        var actualcanY = rst[1];

        if (mousedown1) {
            mousemove1 = true;

            console.log("indice_ponto");
            console.log(indice_ponto_1);

            pointsCtrl_1[indice_ponto_1][0] = actualcanX;
            pointsCtrl_1[indice_ponto_1][1] = actualcanY;

            update_curves();
        }
    };

    canvas_2.onmousemove = function (evt) {
        var actualX = evt.clientX;
        var actualY = evt.clientY;
        var rst = viewportToCanonicalCoordinates(actualX, actualY, canvas_2, 2);
        var actualcanX = rst[0];
        var actualcanY = rst[1];

        if (mousedown2) {
            mousemove2 = true;

            console.log("indice_ponto");
            console.log(indice_ponto_2);

            pointsCtrl_2[indice_ponto_2][0] = actualcanX;
            pointsCtrl_2[indice_ponto_2][1] = actualcanY;

            update_curves();
        }

    };

    canvas_3.onmousemove = function (evt) {
        var actualX = evt.clientX;
        var actualY = evt.clientY;
        var rst = viewportToCanonicalCoordinates(actualX, actualY, canvas_3, 3);
        var actualcanX = rst[0];
        var actualcanY = rst[1];

        if (mousedown3) {
            var trackball_obj = new Trackball(centroid, radius);

            rotationMatrix = mult(rotationMatrix,
                        trackball_obj.rotation(lastcanX, lastcanY, actualcanX, actualcanY, 'm'));
        }

    };

    canvas_1.onmouseup = function (evt) {
        var X = evt.clientX;
        var Y = evt.clientY;
        var rst = viewportToCanonicalCoordinates(X, Y, canvas_1, 1);
        var canX = rst[0];
        var canY = rst[1];

        switch (evt.which) {
            case 1:
                mousedown1 = false;
                if (!mousemove1) {
                    var newPoint = vec4(canX, canY, 0.0, 1.0);
                    pointsCtrl_1.push(newPoint);

                    update_curves();
                }
                mousemove1 = false;
        }
    };

    canvas_2.onmouseup = function (evt) {
        var X = evt.clientX;
        var Y = evt.clientY;
        var rst = viewportToCanonicalCoordinates(X, Y, canvas_2, 2);
        var canX = rst[0];
        var canY = rst[1];

        switch (evt.which) {
            case 1:
                mousedown2 = false;
                if (!mousemove2) {
                    var newPoint = vec4(canX, canY, 0.0, 1.0);
                    pointsCtrl_2.push(newPoint);

                    update_curves();
                }
                mousemove2 = false;
        }
    };

    canvas_3.onmouseup = function (evt) {
        switch (evt.which) {
            case 1:
                mousedown3 = false;
        }
    };

    update_curves();

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
    gl_1.lineWidth(2);
    gl_2.lineWidth(2);

    eye = vec3(cradius * Math.sin(ctheta) * Math.cos(cphi),
               cradius * Math.sin(ctheta) * Math.sin(cphi),
               cradius * Math.cos(ctheta));

    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrix = mult(modelViewMatrix, scaleM(vec3(ratio*3, 1, 1)));
    projectionMatrix = ortho(xleft, xright, ybottom, ytop, znear, zfar);

    gl_1.uniformMatrix4fv(modelViewMatrixLoc_1, false, flatten(modelViewMatrix));
    gl_1.uniformMatrix4fv(projectionMatrixLoc_1, false, flatten(projectionMatrix));

    gl_1.uniform4fv(gl_1.getUniformLocation(program_1, "color"),
                  flatten(color_blue) );
    gl_1.drawArrays( gl_1.POINTS, 0, pointsCtrl_1.length);

    gl_1.uniform4fv(gl_1.getUniformLocation(program_1, "color"),
                  flatten(color_white) );
    gl_1.drawArrays( gl_1.LINE_LOOP, 0, pointsCtrl_1.length);

    gl_1.uniform4fv(gl_1.getUniformLocation(program_1, "color"),
                  flatten(color_darkblue) );
    gl_1.drawArrays( gl_1.LINE_STRIP, pointsCtrl_1.length, pointsCurve_1.length);

    gl_2.uniformMatrix4fv(modelViewMatrixLoc_2, false, flatten(modelViewMatrix));
    gl_2.uniformMatrix4fv(projectionMatrixLoc_2, false, flatten(projectionMatrix));

    gl_2.uniform4fv(gl_2.getUniformLocation(program_2, "color"),
                  flatten(color_green) );
    gl_2.drawArrays( gl_2.POINTS, 0, pointsCtrl_2.length );

    gl_2.uniform4fv(gl_2.getUniformLocation(program_2, "color"),
                  flatten(color_white) );
    gl_2.drawArrays( gl_2.LINE_STRIP, 0, pointsCtrl_2.length );

    gl_2.uniform4fv(gl_2.getUniformLocation(program_2, "color"),
                  flatten(color_darkgreen) );
    gl_2.drawArrays( gl_2.LINE_STRIP, pointsCtrl_2.length, pointsCurve_2.length );

    gl_3.uniformMatrix4fv(modelViewMatrixLoc_3, false, flatten(modelViewMatrix));
    gl_3.uniformMatrix4fv(projectionMatrixLoc_3, false, flatten(projectionMatrix));
    gl_3.uniformMatrix4fv(rotationMatrixLoc, false, flatten(rotationMatrix));
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

function viewportToCanonicalCoordinates(x, y, canvas, id_canvas) {
    var vp_right = canvas.width;
    var vp_top = canvas.height;
    var can_x;
    var can_y;

    // "Move" o canvas para o canto esquerdo da tela.
    if (id_canvas == 2)
        x = x - canvas.width;
    if (id_canvas == 3)
        x = x - (canvas.width*2);

    can_x = (x * (2/vp_right)) - 1;
    // Point (0, 0) in canvas is the upper left coner.
    can_y = 1 - (y * (2/vp_top));

    return [can_x, can_y];
}

function pontoClicado(x, y, id_canvas) {
    var id = -1;
    var dist = 1000;
    var dist_aux;

    if (id_canvas == 1) {
        console.log(pointsCtrl_1.length);
        for (var i = 0; i < pointsCtrl_1.length; i++) {
            dist_aux = distancia(pointsCtrl_1[i][0], pointsCtrl_1[i][1], x, y);
            console.log("dist_aux");
            console.log(dist_aux);
            if (dist > dist_aux) {
                dist = dist_aux;
                id = i;
            }
        }
    }
    else {
        for (var i = 0; i < pointsCtrl_2.length; i++) {
            dist_aux = distancia(pointsCtrl_2[i][0], pointsCtrl_2[i][1], x, y);
            if (dist > dist_aux) {
                dist = dist_aux;
                id = i;
            }
        }
    }

    console.log("id");
    console.log(id);
    return id;
}

function distancia(xp, yp, x, y) {
    var dx = xp - x;
    var dy = yp - y;

    var dist = Math.sqrt(dx*dx + dy*dy);

    return dist;
}

function boundingSphereRadiusCenter(points) {
    var dimension_maxX = -1000;
    var dimension_maxY = -1000;
    var dimension_maxZ = -1000;
    var dimension_minX = 1000;
    var dimension_minY = 1000;
    var dimension_minZ = 1000;

    for (var i = 0; i < points.length; i++) {
        if (dimension_maxX < points[i][0])
            dimension_maxX = points[i][0];
        if (dimension_maxY < points[i][1])
            dimension_maxY = points[i][1];
        if (dimension_maxZ < points[i][2])
            dimension_maxZ = points[i][2];

        if (dimension_minX > points[i][0])
            dimension_minX = points[i][0];
        if (dimension_minY > points[i][1])
            dimension_minY = points[i][1];
        if (dimension_minZ > points[i][2])
            dimension_minZ = points[i][2];
    }

    var diameter = Math.sqrt(
        Math.pow(dimension_maxX - dimension_minX, 2)
        + Math.pow(dimension_maxY - dimension_minY, 2)
        + Math.pow(dimension_maxZ - dimension_minZ, 2)
    );

    var centroid = vec3(
        (dimension_maxX + dimension_minX)/2,
        (dimension_maxY + dimension_minY)/2,
        (dimension_maxZ + dimension_minZ)/2
    );

    return [diameter/2, centroid];
}

function update_curves() {
    if (curve_type == 1) {
        closedCurve = new BSpline(degree, pointsCtrl_1, true);
        openCurve = new BSpline(degree, pointsCtrl_2);
    }
    else {
        closedCurve = new RaG(std_deviation, pointsCtrl_1, true);
        openCurve = new RaG(std_deviation, pointsCtrl_2);
    }

    pointsCurve_1 = closedCurve.generatePoints(num_subdivisions);
    pointsCurve_2 = openCurve.generatePoints(num_subdivisions);

    pointsArray_1 = pointsCtrl_1.concat(pointsCurve_1);
    pointsArray_2 = pointsCtrl_2.concat(pointsCurve_2);
}
