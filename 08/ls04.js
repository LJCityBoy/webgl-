let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    attribute vec4 a_Normal;
    uniform mat4 u_ModelMatrix; //模型矩阵
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_NormalMatrix;
    uniform vec3 u_LightColor; //光的颜色
    uniform vec3 u_LightDirection; //光的方向
    uniform vec3 u_LightPosition; //光源位置
    uniform vec3 u_AmbientLight; //环境光
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
        //计算变换后的法向量
        vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
        //计算顶点世界坐标
        vec4 vertexPosition = u_ModelMatrix * a_Position;
        //计算光线方向
        vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
        //计算光线方向和法向量的点击
        float lDot = max(dot(lightDirection,normal),0.0);

        //计算漫反射光颜色
        vec3 diffuse = u_LightColor * a_Color.rgb * lDot;

        //计算环境反射光颜色
        vec3 ambient = u_AmbientLight * a_Color.rgb; 
        v_Color = vec4(diffuse + ambient,a_Color.a);
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

    //颜色顶点1
    let colors = new Float32Array([
            0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
            0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //right
            1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //up
            1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
            1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, //btm
            0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 //back
        ])
        //颜色顶点2
    let color_WHIDE = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ])

    //法向量
    let normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, //
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, //
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, //
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, //
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, //
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 //
    ])

    //顶点索引
    let indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ])

    initArrBuffer(gl, boxVertiese, "a_Position", 3, gl.FLOAT);

    initArrBuffer(gl, color_WHIDE, "a_Color", 3, gl.FLOAT);

    initArrBuffer(gl, normals, "a_Normal", 3, gl.FLOAT);

    initIndicesBuffer(gl, indices)

    let u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    let u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
    let u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
    let u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
    let u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
    let u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");

    let modelMatrix = new Matrix4(); //模型矩阵
    let normalMatrix = new Matrix4(); //法向量变换矩阵

    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(45, canvas.width / canvas.height, 1.0, 100.0);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    modelMatrix.setTranslate(0, 0, 0); //沿着y轴平移0
    modelMatrix.setRotate(10, 0, 0, 1); //沿着Z轴旋转10度

    //根据模型矩阵计算用来变换的法向量矩阵
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    //设置点光源位置
    gl.uniform3f(u_LightPosition, 1.0, 2.0, 3.0);


    //设置光线颜色
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    //设置光的方向
    let lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize(); //归一化
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    //设置环境光
    gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
})

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

//创建索引缓冲函数封装
function initIndicesBuffer(webgl, data) {
    let indicesBuffer = webgl.createBuffer()
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, data, webgl.STATIC_DRAW);
    return true
}