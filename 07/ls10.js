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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //创建立方体的顶点和颜色
    let boxVertiese = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, //front面 v0-4
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, //right v0345
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, //up v0561
        -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, //left 
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, //down
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0 //back
    ])

    let colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //right
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //up
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
        1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, //btm
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 //back
    ])

    let color_WHIDE = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ])

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ])



    //顶点buffer
    // let vertexBuffer = gl.createBuffer()
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, boxVertiese, gl.STATIC_DRAW);

    // let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    // gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(a_Position);
    initArrBuffer(gl, boxVertiese, "a_Position", 3, gl.FLOAT);




    // let colorBuffer = gl.createBuffer()
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    // let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(a_Color);
    initArrBuffer(gl, colors, "a_Color", 3, gl.FLOAT);


    //顶点索引buffer
    // let indicesBuffer = gl.createBuffer()
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    initIndicesBuffer(gl, indices)

    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    let u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);



    //创建缓冲区函数封装（顶点及颜色缓冲）
    function initArrBuffer(webgl, data, name, num, type) {

        let vertexBuffer = webgl.createBuffer()
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, data, webgl.STATIC_DRAW);
        let vertexLocation = gl.getAttribLocation(gl.program, name);
        webgl.vertexAttribPointer(vertexLocation, num, type, false, 0, 0);
        webgl.enableVertexAttribArray(vertexLocation);

        return -1;
    }

    //创建索引缓冲函数封装
    function initIndicesBuffer(webgl, data) {
        let indicesBuffer = webgl.createBuffer()
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, data, webgl.STATIC_DRAW);
        return true
    }


})