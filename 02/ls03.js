let vertextShader = `
precision mediump float;

attribute vec4 a_Position;
attribute float a_PointSize;

void main(){
    gl_Position=a_Position;
    gl_PointSize = a_PointSize;
}
`

let fragementShader = `

precision mediump float;

void main(){
    gl_FragColor=vec4(1.0,0.0,0.,1.);
}

`

ready(function() {

    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas)
    if (!canvas) {
        console.error("!webgl！")
        return;
    }

    let gl = canvas.getContext('webgl');
    //初始化着色器
    if (!initShaders(gl, vertextShader, fragementShader)) {
        console.error('shader!!!');
        return;
    }

    //获取a_Positon 变量
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize'); // 点大小


    //赋值
    // gl.vertexAttrib3f(a_Position, 0., .5, 0.); 方法1

    gl.vertexAttrib4fv(a_Position, new Float32Array([0.0, -0.5, 0.0, 1.0])); //方法2

    gl.vertexAttrib1f(a_PointSize, 30.0);
    setTimeout(() => {
        gl.vertexAttrib1f(a_PointSize, 50.0);

    }, 4000);

    gl.clearColor(0., 1., .2, 1.);

    function render() {


        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.POINTS, 0, 1);
        requestAnimationFrame(render)
    }
    render()

})