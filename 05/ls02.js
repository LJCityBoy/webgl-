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

    //创建带大小的顶点数据
    let sizePoints = new Float32Array([
        0.0, 0.5, 10.0, -0.5, 0.0, 20.0,
        0.5, 0.0, 30
    ])

    let FSIZE = sizePoints.BYTES_PER_ELEMENT; //计算每个元素的大小
    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizePoints, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position)

    let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2); //偏移两个元素
    gl.enableVertexAttribArray(a_PointSize);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);
})