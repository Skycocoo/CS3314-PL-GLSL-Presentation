// Created by Yuxi Luo; June 2018

varying lowp vec4 vColor;
varying highp vec3 vLighting;

void main(void) {
    gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);
    // gl_FragColor = vec4(vColor.rgb, vColor.a);
    // gl_FragColor = vec4(1, 1, 0, 1);
}
