let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ViewMatrix;
    void main(){
        gl_Position = u_ViewMatrix * a_Position;
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
        return;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);

    //创建数据

    let verticesColors = new Float32Array([
        //顶点和颜色
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, //绿色三角形
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, //黄色三角形
        -0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, //蓝色三角形
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,

    ])
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    const len = verticesColors.length / 6; //顶点数

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    //顶点
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    //颜色
    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    //设置观察者视点
    let u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");

    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.00, 0.25, 0.25, 0.0, 0.0, 0.0, 0.1, 1.0, 0.0) //位置 =》 看向原点 => 向上方向

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, len);


})