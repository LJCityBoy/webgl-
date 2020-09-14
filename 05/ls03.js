let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 15.0;
        v_Color = a_Color;
    }
`
let fragmentShader = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
    }
`

ready(() => {
    let canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    document.body.appendChild(canvas);

    let gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertexShader, fragmentShader)) {
        console.error('不支持webgl!');
        return false;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);

    //带有颜色的顶点数组
    let vertiesColor = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,

        -0.5, 0.0, 0.0, 1.0, 0.4,

        0.5, 0.0, 0.0, 0.1, 1.0
    ])

    let vertexBUffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBUffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertiesColor, gl.STATIC_DRAW);

    let FSIZE = vertiesColor.BYTES_PER_ELEMENT
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color)

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);

})