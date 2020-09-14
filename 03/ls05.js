let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    uniform float u_CosB;
    uniform float u_SinB;
    void main(){
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        gl_Position.z = a_Position.z;
        gl_Position.w = a_Position.w;
    }
`
let fragmentShader = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
`

//平移
ready(function() {
    let canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    document.body.appendChild(canvas);

    let gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertexShader, fragmentShader)) {
        console.error('不支持webgl!');
        return false;
    }

    let vertices = new Float32Array([
        0.0, 0.5, -0.5, 0.0, 0.0, -0.5, 0.5, 0.0
    ])

    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    //把数据写到缓冲区
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    let u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    let ANGLE = 45; // 旋转角度
    let radian = Math.PI * ANGLE / 180; //转为弧度制

    gl.uniform1f(u_CosB, Math.cos(radian));
    gl.uniform1f(u_SinB, Math.sin(radian));

    gl.clearColor(0.4, 0.5, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
})