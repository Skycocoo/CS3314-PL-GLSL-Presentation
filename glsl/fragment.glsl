// Created by Yuxi Luo; June 2018

varying lowp vec4 vColor;

void main(void) {
    gl_FragColor = vec4(vColor.rgb, vColor.a);
    // gl_FragColor = vec4(1, 0, 0, 1);
}
