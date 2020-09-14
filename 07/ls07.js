let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    // uniform mat4 u_ModelMatrix;
    // uniform mat4 u_ViewMatrix;
    // uniform mat4 u_ProjMatrix;
    uniform mat4 u_MvpMatrix;
    void main(){
        //gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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


    //通过平移方式画两次
    let dataArr = new Float32Array([
        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, //最后面的三角形
        0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -2.0, 1.0, 1.0, 0.4, //中间三角形
        0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -0.0, 0.4, 0.4, 1.0, //最前面三角形
        0.25, -1.0, -0.0, 0.4, 0.4, 0.4,
        1.25, -1.0, -0.0, 1.0, 0.4, 0.4,

        // -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, //左侧最后三角形
        // -1.25, -1.0, -4.0, 0.4, 1.0, 0.4, //
        // -0.25, -1.0, -4.0, 1.0, 0.4, 0.4, //

        // -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, //左侧中间
        // -1.25, -1.0, -2.0, 1.0, 1.0, 0.4, //
        // -0.25, -1.0, -2.0, 1.0, 0.4, 0.4, //

        // -0.75, 1.0, 0.0, 0.4, 0.4, 1.0, // 左侧最前
        // -1.25, -1.0, 0.0, 0.4, 0.4, 1.0, // 
        // -0.25, -1.0, 0.0, 1.0, 0.4, 0.4
    ])


    let FSIZE = dataArr.BYTES_PER_ELEMENT;
    let n = dataArr.length / 6;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataArr, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    //获取u_ViewMatrix u_ProjMatrix
    // let u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    // let u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    // let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    let u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");


    //创建矩阵
    let modelMatrix = new Matrix4();
    let viewMAtrix = new Matrix4();
    let projMatrix = new Matrix4();
    let mvpMatrix = new Matrix4();

    modelMatrix.setTranslate(0.0, 0.0, 0.0);
    viewMAtrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    projMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100.0);

    mvpMatrix.set(projMatrix).multiply(viewMAtrix).multiply(modelMatrix);

    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMAtrix.elements);
    // gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

    modelMatrix.setTranslate(-1.5, 0.0, 0.0);
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    mvpMatrix.set(projMatrix).multiply(viewMAtrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);



})