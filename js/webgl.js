let canvas = document.getElementById("webgl");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.zIndex = "1";

window.addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
});

const gl = canvas.getContext("webgl");

function getShaderFromUrl(url) {
	var req = new XMLHttpRequest();
	req.open("GET", url, false);
	req.send(null);
	return req.responseText;
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	let scaleX = 1 / rect.width;
	let scaleY = 1 / rect.height;
	let x = (evt.clientX - rect.left) * scaleX;
	let y = (evt.clientY - rect.top) * scaleY;
	y = 1 - y;
	return { x, y };
}

cursor = [0, 0];
document.addEventListener("mousemove", (e) => {
	let pos = getMousePos(canvas, e);
	cursor = [pos.x, pos.y];
});
mouseDown = false;
document.addEventListener("mousedown", (e) => {
	mouseDown = true;
});
document.addEventListener("mouseup", (e) => {
	mouseDown = false;
});

let vs = getShaderFromUrl("shaders/shader.vert");
let fs = getShaderFromUrl("shaders/shader.frag");

console.group("%cShader", "font-size: large");
console.log(vs);
console.log(fs);
console.groupEnd();

const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

const arrays = {
	position: {
		data: [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0],
		numComponents: 2,
	},
};

const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
const offset = Math.random();

const rain = document.getElementById("rain");
const rainCtx = rain.getContext("2d");
let texture = twgl.createTexture(gl, {
	src: rain,
	flipY: true,
	premultiplyAlpha: true,
});

function render() {
	twgl.setTextureFromElement(gl, texture, rain);

	let uniforms = {
		resolution: [gl.canvas.width, gl.canvas.height],
		time: performance.now() / 1000.0,
		offset,
		texture,
		random: Math.random(),
		cursor: cursor,
		mouseDown,
	};

	gl.useProgram(programInfo.program);
	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	twgl.setUniforms(programInfo, uniforms);
	twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLE_STRIP);

	//requestAnimationFrame(render);
}

const startTime = new Date().valueOf();
window.onclick = () => {
	const loadedSeconds = (new Date().valueOf() - startTime) / 1000;
	// if (loadedSeconds > 5)
	requestAnimationFrame(render);
	document.getElementById("rain").style.display = "none";
};

//ontouch for mobile

window.addEventListener("touchstart", (event) => {
	const loadedSeconds = (new Date().valueOf() - startTime) / 1000;
	// if (loadedSeconds > 5)
	requestAnimationFrame(render);
	document.getElementById("rain").style.display = "none";
});
