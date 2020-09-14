let vertexShader = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main(){
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`

let fragmentShader = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    void main(){
        gl_FragColor = texture2D(u_Sampler,v_TexCoord);
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
        return false;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);

    //前面两个为顶点坐标 后两位为纹理坐标
    // let verties = new Float32Array([-0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0,
    //     0.5, 0.5, 1.0, 1.0,
    //     0.5, -0.5, 1.0, 0.0
    // ])
    let verties = new Float32Array([-0.5, 0.5, -0.3, 1.7, -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2
    ])

    const FSIZE = verties.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    //分配纹理坐标
    let a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord)



    //加载图片纹理
    imageLoader('http://127.0.0.1:5500/static/sky.jpg').then(function(img) {

        //在这里开始记载纹理

        let texture = gl.createTexture(); //创建纹理对象
        let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

        //纹理Y轴旋转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        //开启0号纹理
        gl.activeTexture(gl.TEXTURE0);
        //绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //纹理放大： TEXTURE_MAG_FILTER, 纹理缩小： TEXTURE_MIN_FILTER,纹理水平填充：TEXTURE_WRAP_S，纹理垂直填充：TEXTURE_WRAP_T
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

        //将0号纹理传递给着色器
        gl.uniform1i(u_Sampler, 0);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    })


    //写一个图片加载函数
    function imageLoader(url) {
        return new Promise(function(resolve, reject) {
            let img = new Image();
            //加载成功回调
            img.onload = function() {
                    resolve(img)
                }
                //加载出错
            img.error = function(e) {
                console.error('图片加载失败！');
                reject(e)
            }
            img.src = url;
        })
    }
})