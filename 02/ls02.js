let vertextShader = `
    precision mediump float;
    void main(){
        gl_Position = vec4(0.0,0.0,0.0,1.0);
        gl_PointSize = 10.0;
    }
`

let fragementShader = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(1.0,0.0,1.0,1.0);
    }

`

ready(() => {
    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas)
    if (!canvas) {
        console.error("xxxxx")
        return;
    }

    let gl = canvas.getContext('webgl');
    //初始化着色器
    if (!initShaders(gl, vertextShader, fragementShader)) {
        console.error('着色器初始化失败！');
        return;
    }


    gl.clearColor(0.1, 0.7, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制
    gl.drawArrays(gl.POINTS, 0, 1);



})