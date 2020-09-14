ready(() => {

    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas)
    if (!canvas) {
        console.error("xxxxx")
        return;
    }

    let webgl = canvas.getContext('webgl')

    // webgl.clearColor(1, 0, 1, 0.5);
    // webgl.clear(webgl.COLOR_BUFFER_BIT);

    webgl.clearDepth(1.0);
    webgl.clear(webgl.DEPTH_BUFFER_BIT);

})