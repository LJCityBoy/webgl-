let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Normal;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        vec4 color = vec4(1.0,0.4,0.0,1.0);
        vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
        vec3 lightDirection = normalize(vec3(0.0,0.5,0.7));
        float nDotL = max(dot(normal,lightDirection),0.0);
        v_Color = vec4(color.rgb * nDotL + vec3(0.1),color.a);
    }

`
let fragmentShader = `
#ifdef GL_ES 
precision mediump float;
#endif
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
    const gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertexShader, fragmentShader)) {
        console.error("不支持webgl");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
        -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, // v1-v6-v7-v2 left
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, // v7-v4-v3-v2 down
        1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5 // v4-v7-v6-v5 back
    ])

    let normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
    ])

    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ])

    initArrBuffer(gl, vertices, 'a_Position', 3, gl.FLOAT);
    initArrBuffer(gl, normals, "a_Normal", 3, gl.FLOAT);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('创建buffer 失败');
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);




    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

    let viewProjMatrix = new Matrix4();
    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);


    let ANGLE_STEP = 3.0; //每次旋转角度增量
    let g_arm1Angle = -90.0; //arm1 旋转角度
    let g_joint1Angle = 0.0; //joint1 旋转角度
    let g_modelMatrix = new Matrix4(),
        g_mvpMatrix = new Matrix4();
    let g_normalMatrix = new Matrix4();
    document.onkeydown = function(ev) {
        switch (ev.keyCode) {
            case 38:
                if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
                break;
            case 40:
                if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
                break;
            case 39:
                g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
                break;
            case 37:
                g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
                break;

            default:
                break;
        }
        draw(gl, indices.length, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
    }

    draw(gl, indices.length, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);



    //创建缓冲区函数封装（顶点及颜色缓冲）
    function initArrBuffer(webgl, data, name, num, type) {

        let vertexBuffer = webgl.createBuffer()
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, data, webgl.STATIC_DRAW);
        let vertexLocation = webgl.getAttribLocation(webgl.program, name);
        webgl.vertexAttribPointer(vertexLocation, num, type, false, 0, 0);
        webgl.enableVertexAttribArray(vertexLocation);

        return -1;
    }


    //绘制
    function draw(webgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

        //arm1
        let arm1Length = 10.0;
        g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
        g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
        drawBox(webgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

        // Arm2
        g_modelMatrix.translate(0.0, arm1Length, 0.0);　　　
        g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
        g_modelMatrix.scale(1.3, 1.0, 1.3);
        drawBox(webgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix); // Draw

    }


    function drawBox(webgl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
        g_mvpMatrix.set(viewProjMatrix);
        g_mvpMatrix.multiply(g_modelMatrix);
        webgl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

        g_normalMatrix.setInverseOf(g_modelMatrix);
        g_normalMatrix.transpose();
        webgl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

        webgl.drawElements(webgl.TRIANGLES, n, webgl.UNSIGNED_BYTE, 0);
    }

})