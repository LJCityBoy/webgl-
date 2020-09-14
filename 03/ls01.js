let vertextShader = `
    precision mediump float;
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`
let fragmentShader = `
    void main(){
        gl_FragColor = vec4(1.0,0.1,0.1,1.0);
    }
`

ready(function() {
    let canvas = document.createElement('canvas')
    canvas.width = 700;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertextShader, fragmentShader)) {
        console.error('不支持webgl!');
        return;
    }
    let n = initVertexBuffer(gl);
    if (n < 0) {
        console.error("initVertexBuffer error");
        return;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);

    //创建顶点方法
    function initVertexBuffer(gl) {
        let vertices = new Float32Array([
            0.0, 0.5, -0.5, -0.5, 0.5, -0.5
        ])
        let n = 3; //点的个数

        //创建缓冲区对象
        let vertexBuff = gl.createBuffer();
        if (!vertextShader) {
            console.error('createBuffer err');
            return -1;
        }

        //将缓冲区对象绑定到目标
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

        //向缓冲区对象写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        let a_Position = gl.getAttribLocation(gl.program, "a_Position");

        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        return n;

    }
})