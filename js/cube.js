// Created by Yuxi Luo; Dec 2019
/*jshint esversion: 6 */

var Cube = {
    elapsed: 0.0,
    buffer: undefined,

    projectionMatrix: mat4.create(),
    modelMatrix: mat4.create(),
    viewMatrix: mat4.create(),
    modelViewMatrix: mat4.create(),
    normalMatrix: mat4.create(),

    positions: [
        // Front face
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        1.0,  1.0,  1.0,
        1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ],
    vertexNormals: [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ],
    faceColors: [
        [1.0,  1.0,  1.0,  1.0],    // Front face: white
        [1.0,  0.0,  0.0,  0.5],    // Back face: red
        [0.0,  1.0,  0.0,  0.5],    // Top face: green
        [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
        [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
        [1.0,  0.0,  1.0,  0.5],    // Left face: purple
    ],
    // each face as two triangles
    indices: [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ],
    updateElapsed: function(deltaTime) {
        this.elapsed += deltaTime;
    },
    update: function(trans) {
        this.projectionMatrix = mat4.create();
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        this.normalMatrix = mat4.create();

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        // projection matrix
        mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // model matrix
        mat4.translate(this.modelMatrix, this.modelMatrix, trans);  // amount to translate
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.1, 0.1, 0.1]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.elapsed, [0, 1, 0]);       // axis to rotate around
        // mat4.rotate(this.modelMatrix, this.modelMatrix, this.elapsed * 0.7, [0, 1, 0]);

        // view matrix
        var distance = 30;
        mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, distance]);
        // mat4.translate(this.viewMatrix, this.viewMatrix, [(-distance * Math.sin(this.elapsed)), 0, (distance * Math.cos(this.elapsed))]);
        var eye = [this.viewMatrix[12], this.viewMatrix[13], this.viewMatrix[14]],
            center = [0, 0, 0],
            up = [0, 1, 0];
        mat4.lookAt(this.viewMatrix, eye, center, up);

        // modelview matrix
        mat4.multiply(this.modelViewMatrix, this.viewMatrix, this.modelMatrix);

        // normal matrix
        mat4.invert(this.normalMatrix, this.modelViewMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);

    },
    render: function(shaderProgram) {
        gl.useProgram(shaderProgram.programID);

        // position
        // gl.vertexAttribPointer(
        //     programInfo.attribLocations.vertexPosition,
        //     numComponents,
        //     type,
        //     normalize,
        //     stride,
        //     offset);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
        gl.vertexAttribPointer(shaderProgram.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.attribLocations.vertexPosition);

        // color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.color);
        gl.vertexAttribPointer(shaderProgram.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.attribLocations.vertexColor);

        // normal
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normal);
        gl.vertexAttribPointer(shaderProgram.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.attribLocations.vertexNormal);

        // indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // matrices
        gl.uniformMatrix4fv(shaderProgram.uniformLocations.projectionMatrix, false, this.projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);
        gl.uniformMatrix4fv(shaderProgram.uniformLocations.normalMatrix, false, this.normalMatrix);


        // gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    },
    initBuffer: function() {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

        // Convert the array of colors into a table for all the vertices.
        var colors = [];
        for (var j = 0; j < this.faceColors.length; ++j) {
            const c = this.faceColors[j];
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);


        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals), gl.STATIC_DRAW);

        this.buffer = {
            position: positionBuffer,
            normal: normalBuffer,
            indices: indexBuffer,
            color: colorBuffer,
         };
    }
};
