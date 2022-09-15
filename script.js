// Variables
const particleLimit = 500;
const layerCount = particleLimit / 100 > 1 ? particleLimit / 100 : 1;
const particleArray = Array.from({ length: layerCount }, () => []);
const gravity = 9;
const friction = 0.5;
const canvases = [];

// Debug Logs

console.log(`Particle Limit: ${particleLimit}`);
console.log(`Canvas Count: ${layerCount}`);
console.log(`Gravity: ${gravity}`);
console.log(`Friction: ${friction}`);
console.log(`Particles per canvas: ${particleLimit / layerCount}`);

for (let i = 0; i < layerCount; i++) {
	const canvas = document.createElement("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = "absolute";
	canvas.style.top = "0";
	canvas.style.left = "0";
	canvas.style.zIndex = i;
	document.body.appendChild(canvas);
	canvases.push(canvas);
}

// Auto-resize canvas when window size changes

window.addEventListener("resize", () => {
	for (let i = 0; i < canvases.length; i++) {
		canvases[i].width = window.innerWidth;
		canvases[i].height = window.innerHeight;
	}
});

// Helper Funcs

const roundNumber = (rnum, rlength) =>
	Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);

// Get mouse position

let mouse = {
	x: null,
	y: null,
	radius: (canvases[0].height / 80) * (canvases[0].width / 80),
};

window.addEventListener("mousemove", (event) => {
	mouse.x = event.x;
	mouse.y = event.y;
});

// Create constructor function for individual particles

function Particle(x, y, directionX, directionY, size, color, layer) {
	this.x = x;
	this.y = y;
	this.directionX = directionX;
	this.directionY = directionY;
	this.size = size;
	this.color = color;

	// Method to draw individual particle
	this.draw = function () {
		const ctx = canvases[layer].getContext("2d");
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.size, this.y - 10);
		ctx.lineTo(this.x + this.size * 2, this.y);
		ctx.arc(this.x + this.size, this.y, this.size, 0, Math.PI, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke(); // Render the path
		ctx.closePath();
	};

	// Method to make particles fall like rain
	this.update = function () {
		if (this.y > canvases[layer].height) {
			this.y = 0 - this.size;
			this.x = Math.floor(
				Math.random() * (innerWidth - size * 2 - size * 2) + size * 2
			);
			this.directionX = 20;
			this.directionY = Math.floor(Math.random() * 0.4 - 0.2);
		} else {
			this.directionY += gravity;
		}

		this.x += this.directionX;
		this.y += this.directionY;

		this.draw();
	};
}

// Render particles

function init() {
	let currentLayer = 0;
	// When a layer is full, move to the next layer
	for (let i = 0; i < particleLimit; i++) {
		if (particleArray[currentLayer].length >= particleLimit / layerCount) {
			currentLayer++;
		}

		//Particle
		let size = Math.floor(Math.random() * (8 - 2) + 2);
		let x = Math.floor(
			Math.random() * (innerWidth - size * 2 - size * 2) + size * 2
		);
		let y = Math.floor(
			Math.random() * (innerHeight - size * 2 - size * 2) + size * 2
		);
		let directionX = 20;
		let directionY = Math.floor(Math.random() * 0.4 - 0.2);
		//random color
		let color = `white`;

		particleArray[currentLayer].push(
			new Particle(x, y, directionX, directionY, size, color, currentLayer)
		);
	}
}

// Draw particles

function draw() {
	for (let i = 0; i < particleArray.length; i++) {
		const ctx = canvases[i].getContext("2d");
		ctx.clearRect(0, 0, innerWidth, innerHeight);
		console.log(ctx.clearRect(0, 0, innerWidth, innerHeight));
		for (let j = 0; j < particleArray[i].length; j++) {
			particleArray[i][j].update();
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	draw();
}

init();
animate();
