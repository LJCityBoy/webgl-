let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_MvpMatrix;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
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

ready(function() {
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
    gl.enable(gl.DEPTH_TEST);

    //创建立方体的顶点和颜色
    let boxVertiese = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 0.7, //近白色
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, //品红
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, //红色
        1.0, -1.0, 1.0, 1.0, 0.2, 0.5, //
        1.0, -1.0, -1.0, 0.0, 0.0, 0.5, //
        1.0, 1.0, -1.0, 0.2, 0.8, 1.0, //
        -1.0, 1.0, -1.0, 0.8, 0.8, 0.1, //
        -1.0, -1.0, -1.0, 0.0, 0.4, 0.1 //
    ])

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, //前
        0, 3, 4, 0, 4, 5, //右
        0, 5, 6, 0, 6, 1, //上
        1, 6, 7, 1, 7, 2, //左
        7, 4, 3, 7, 3, 2, //下
        4, 7, 6, 4, 6, 5 //后
    ])

    //顶点buffer
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, boxVertiese, gl.STATIC_DRAW);

    const FSIZE = boxVertiese.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);


    //顶点索引buffer
    let indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    let u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);


})