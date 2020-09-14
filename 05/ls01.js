let vertexShader = `
precision mediump float;
attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}
`

let fragmentShader = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
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

    //顶点数组
    let vertices = new Float32Array([
            0.0, 0.5, 0.5, 0.0, -0.5, 0.0
        ])
        //顶点大小数组
    let sizes = new Float32Array([
        10.0, 20.0, 30.0
    ])

    let vertexbuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    //点大小数据
    let vertexSizebuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizebuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

    let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 3);



})