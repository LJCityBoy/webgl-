let vertextShader = `
    precision mediump float;
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
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
    if (!initShaders(gl, vertextShader, fragmentShader)) {
        console.error('不支持webgl!');
        return;
    }

    let vertices = new Float32Array([
        0.0, 0.5, -0.5, 0.0, 0.0, -0.5, 0.5, 0.0
    ])

    //创建缓冲区对象
    let vertexBuff = gl.createBuffer()
        //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //把顶点数据传送到顶点变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);




    gl.clearColor(0.4, 0.5, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


})