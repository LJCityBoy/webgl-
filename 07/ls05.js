let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    void main(){
        gl_Position =  u_ProjMatrix * u_ViewMatrix * a_Position;
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

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    let g_near = 0.0;
    let g_far = 2.0;
    let g_eyex = 0.2;
    let g_eyey = 0.25;
    let g_eyez = 0.25;
    let projMatrix = new Matrix4();
    let viewMatrix = new Matrix4();
    let u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    let u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    viewMatrix.setLookAt(g_eyex, g_eyey, g_eyez, 0, 0, 0, 0, 1, 0);
    projMatrix.setOrtho(-1., 1., -1., 1., g_near, g_far);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);

    //监听键盘事件
    document.onkeydown = function(ev) {

        switch (ev.keyCode) {
            case 65: //A
                g_eyex += 0.01;
                break;
            case 68: // D
                g_eyex -= 0.01;
                break;
            case 39: //右方向键
                g_near += 0.01;
                break;
            case 37: //左方向键
                g_near -= 0.01;
                break;
            case 38: //上
                g_far += 0.01;
                break;
            case 40: //下
                g_far -= 0.01;
                break;
            default:
                break;
        }
        viewMatrix.setLookAt(g_eyex, g_eyey, g_eyez, 0, 0, 0, 0, 1, 0);
        projMatrix.setOrtho(-1., 1., -1., 1., g_near, g_far);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 9);
    }

})