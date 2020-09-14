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
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    varying vec2 v_TexCoord;
    void main(){
        vec4 Color1 = texture2D(u_Sampler1,v_TexCoord);
        vec4 Color2 = texture2D(u_Sampler2,v_TexCoord);
        gl_FragColor = Color1 *  Color2;
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
        return false;
    }
    gl.clearColor(0.4, 0.5, 0.1, 1.0);

    //数据
    let verties = new Float32Array([-0.5, 0.5, 0.0, 1.0, -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ])

    const FSIZE = verties.BYTES_PER_ELEMENT;
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    gl.clear(gl.COLOR_BUFFER_BIT);
    let g_texture1 = false,
        g_texture2 = false;
    //加载第一张纹理
    imageLoader("http://127.0.0.1:5500/static/icon.png").then((img) => {
        let texture = gl.createTexture();
        let u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");

        //纹理Y轴旋转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        //开启0号纹理
        gl.activeTexture(gl.TEXTURE0);
        //绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //配置参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        //将纹理传给着色器
        gl.uniform1i(u_Sampler1, 0);

        g_texture1 = true;
        if (g_texture1 && g_texture2) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    })


    //加载第二张纹理
    imageLoader("http://127.0.0.1:5500/static/circle.gif").then((img) => {
        let texture = gl.createTexture();
        let u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler2");

        //纹理Y轴旋转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        //开启0号纹理
        gl.activeTexture(gl.TEXTURE1);
        //绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //配置参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        //将纹理传给着色器
        gl.uniform1i(u_Sampler1, 1);

        g_texture2 = true;
        if (g_texture1 && g_texture2) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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