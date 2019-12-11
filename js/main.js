// Created by Yuxi Luo; Dec 2019

var shaderProgram = new ShaderProgram("glsl/vertex.glsl", "glsl/fragment.glsl");

$(document).ready(function(){
    initGl();
    initResize();
    life.init();
    shaderProgram.initSrc();
});

$(document).ajaxStop(function(){
    shaderProgram.initShader();

    var then = 0,
        count = 0;

    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        count += deltaTime;
        if (count > 0.20) {
            life.gameOfLife();
            life.getBoardPos();
            count = 0;
        }

        life.update(deltaTime);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        life.render(shaderProgram);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
});
