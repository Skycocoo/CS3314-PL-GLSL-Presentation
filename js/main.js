// Created by Yuxi Luo; June 2018

var shaderProgram = new ShaderProgram("glsl/vertex.glsl", "glsl/fragment.glsl");
var cube = Cube;

$(document).ready(function(){
    initGl();
    initResize();
    cube.initBuffer();
    shaderProgram.initSrc();
});

$(document).ajaxStop(function(){
    shaderProgram.initShader();

    var then = 0;

    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        cube.updateElapsed(deltaTime);
        cube.update([0, 0, 0]);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        cube.render(shaderProgram);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
