let vertextShader = `
    precision mediump float;
    attribute vec4 a_Position;
    uniform vec4 a_Translation;
    void main(){
        gl_Position = a_Position  + a_Translation;
    }
`

let fragmentShader = `
    precision mediump float;

    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`
ready(function() {
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
    let vertextBuffer = gl.createBuffer()
        //绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);

    //向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //把数据传送到顶点着色器
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    //移动
    let a_Translation = gl.getUniformLocation(gl.program, 'a_Translation');
    gl.uniform4f(a_Translation, 0.5, 0.2, 0.0, 0.0);

    gl.clearColor(0.4, 0.5, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
})