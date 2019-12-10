// Created by Yuxi Luo; June 2018

// client-side testing:
// http://localhost:63342/Hikari-no-tama/

const canvas = document.querySelector("canvas"),
      gl = document.querySelector("canvas").getContext("webgl")
      clientPath = "http://localhost:63342/GLSL-Presentation/";

// gl
function initGl() {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
};


// resize
function initResize() {
    (function() {
        $(window).on("resize", function() {
            resize(canvas);
        });
        resize(canvas);
    })();
};

function resize(screen) {
    if ((screen.width != screen.clientWidth) || (screen.height != screen.clientHeight)) {
        screen.width = screen.clientWidth;
        screen.height = screen.clientHeight;
        gl.viewport(0, 0, screen.width, screen.height);
    }
};


// shaderProgram
function ShaderProgram(vert, frag) {
    this.vertexSrc = undefined;
    this.fragmentSrc = undefined;
    this.programID = undefined;
    this.attributeLocations = undefined;
    this.uniformLocations = undefined;
    this.path = clientPath;

    this.initSrc = function() {
        var self = this;
        $.get(self.path + vert, function (file) {
            self.vertexSrc = file;
        });
        $.get(self.path + frag, function (file) {
            self.fragmentSrc = file;
        });
    };

    this.initShader = function() {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, this.vertexSrc);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, this.fragmentSrc);

        // Create the shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return;
        }
        this.programID = shaderProgram;
        this.attribLocations = {
            vertexPosition: gl.getAttribLocation(this.programID, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(this.programID, 'aVertexNormal'),
            vertexColor: gl.getAttribLocation(this.programID, 'aVertexColor'),
        };
        this.uniformLocations = {
            projectionMatrix: gl.getUniformLocation(this.programID, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(this.programID, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(this.programID, 'uNormalMatrix'),
        };
    };

    this.loadShader = function(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
};
