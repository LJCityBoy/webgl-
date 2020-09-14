let vertextShader = `
precision mediump float;
attribute vec4 a_Position;

void main(){
    gl_PointSize = 10.0;
    gl_Position = a_Position;
}

`

let fragmentShader = `
precision mediump float;
uniform float a_Color;
void main(){
    gl_FragColor = vec4(a_Color,0.3,a_Color,1.0);
}
`

ready(function() {

    let canvas = document.createElement('canvas')
    canvas.width = 700;
    canvas.height = 500;
    document.body.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    if (!initShaders(gl, vertextShader, fragmentShader)) {
        console.error('不支持webgl!');
        return;
    }
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    let a_Color = gl.getUniformLocation(gl.program, 'a_Color')
    gl.clearColor(0.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let points = []; //存储所有点
    canvas.addEventListener('mousedown', function(e) {
        let x = e.clientX;
        let y = e.clientY;
        let rect = e.target.getBoundingClientRect();
        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2); //计算出x坐标
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2); //计算出y坐标
        points.push({
            "x": x,
            "y": y,
            "z": 0,
            "color": Math.abs(Math.sin(Math.random() * 10))
        })
        gl.clear(gl.COLOR_BUFFER_BIT);
        points.forEach(function(item) {
            gl.vertexAttrib3f(a_Position, item.x, item.y, 0.0);
            gl.uniform1f(a_Color, item.color);
            gl.drawArrays(gl.POINTS, 0, 1);
        })

    })
})