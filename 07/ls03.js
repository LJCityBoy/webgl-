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

    //创建数据源
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

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    //获取a_Position
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    //颜色
    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    //a_ViewMatrix
    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');

    let eye_x = 0.20,
        eye_y = 0.25,
        eye_z = 0.25;
    let viewMatrix = new Matrix4()
    draw(gl, eye_x, eye_y, eye_z, u_ViewMatrix, viewMatrix.elements);
    document.addEventListener('keydown', function(ev) {

        if (ev.keyCode == 87) //w键
        {
            eye_x += 0.01;
        } else if (ev.keyCode == 83) //s键
        {
            eye_x -= 0.01;
        } else {
            return;
        }
        draw(gl, eye_x, eye_y, eye_z, u_ViewMatrix, viewMatrix.elements);
    })

    function draw(wgl, x, y, z, u_mat, v_mat) {
        viewMatrix.setLookAt(x, y, z, 0, 0, 0, 0, 1, 0);
        wgl.uniformMatrix4fv(u_mat, false, v_mat);


        wgl.clear(wgl.COLOR_BUFFER_BIT);
        wgl.drawArrays(wgl.TRIANGLES, 0, 9);
    }



})