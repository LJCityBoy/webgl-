let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main(){
        gl_Position = u_xformMatrix * a_Position;
    }
`

let fragmentShader = `

void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`
    //缩放
ready(() => {
    let canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 700;
    document.body.appendChild(canvas);

    let gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertexShader, fragmentShader)) {
        console.error('不支持webgl!');
        return false;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, 0.0, 0.0, -0.5, 0.5, 0.0
    ])

    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    let a_Postion = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Postion, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Postion);

    let u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
    //缩放度
    let SCALE = 0.1;

    let radian, transformMatrix

    function render() {
        SCALE += 0.01;
        if (SCALE > 2.) SCALE = 0.1;

        //创建旋转矩阵
        transformMatrix = new Float32Array([
            SCALE, 0., 0., 0.,
            0., SCALE, 0., 0.,
            0., 0., SCALE, 0.,
            0., 0., 0., 1.
        ])
        gl.uniformMatrix4fv(u_xformMatrix, false, transformMatrix);


        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        requestAnimationFrame(render)
    }
    render()


})