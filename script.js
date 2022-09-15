const landingCanvas = document.getElementById("landing-canvas");
const landing = document.querySelector(".landing");
landingCanvas.width = landing.clientWidth;
landingCanvas.height = landing.clientHeight;

const G = 0.1; // gravity

/** @type {CanvasRenderingContext2D} **/
const c = landingCanvas.getContext("2d");

// linear gradient bg
let bg = c.createLinearGradient(
	landingCanvas.width / 2,
	0,
	landingCanvas.width / 2,
	landingCanvas.height
);
bg.addColorStop(0, "#0D1B2A");
bg.addColorStop(0.6, "#1B263B");
bg.addColorStop(1, "#415A77");

let clicked = false;
let mx = null;
let my = null;

// Probably a bad way to do this
landing.addEventListener("mousedown", (event) => {
	clicked = true;
});
landing.addEventListener("mouseup", (event) => {
	clicked = false;
});

landing.addEventListener("mousemove", (event) => {
	mx = event.clientX;
	my = event.clientY;
});

// making canvas resize seamless
document.addEventListener("resize", () => {
	landingCanvas.width = landing.clientWidth;
	landingCanvas.height = landing.clientHeight;
});

// Well, the main Raindrop class, nothing else ¯\_('-')_/¯
class RainDrop {
	constructor(vel, pos) {
		// Basic stuff
		this.vel = vel;
		this.pos = pos;
		this.width = 5;
		this.lifetime = 50;
		this.life = this.lifetime;
		this.dying = false;
		this.death_rate = 1;
	}

	update() {
		if (this.dying) {
			this.life -= this.death_rate;
			if (this.width > 0) {
				this.width -= this.death_rate;
			}
		}
		if (this.pos.y > landingCanvas.height) {
			// this._reset();
			this.vel.y *= -0.2;
			this.vel.x *= 0.1;
			this.dying = true;
		}

		if (this.life <= 0) {
			this._reset();
		}

		this.vel.y += G; // Applying gravity

		// Applying velocity
		if (clicked) {
			this.pos.x += this.vel.x / 5;
			this.pos.y += this.vel.y / 5;
			this.life += this.death_rate / 2;
		} else {
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
		}
	}

	// Making it seamless
	_reset() {
		this.pos.x =
			Math.random() * 2 * landingCanvas.clientWidth - landingCanvas.clientWidth;
		this.pos.y = Math.random() * -200;
		this.width = 5;
		let v = 10 + Math.random() * 50;
		this.vel.x = v;
		this.vel.y = v + Math.random();
		this.life = this.lifetime;
		this.dying = false;
	}

	// Drawing
	draw() {
		c.beginPath();
		// c.strokeStyle = "#778DA9";
		c.strokeStyle = "rgba(224, 225, 221, 0.2)";
		c.lineWidth = this.width;
		c.lineCap = "round";
		c.moveTo(this.pos.x, this.pos.y);
		c.lineTo(this.pos.x + this.vel.x, this.pos.y + this.vel.y);
		c.stroke();
		c.closePath();
	}
}

// All the drops
let drops = [];
for (let i = 0; i <= 1000; i++) {
	spawnRain(1000);
}

function spawnRain(max_num) {
	if (drops.length < max_num) {
		console.log("Spawned");
		let x =
			Math.random() * 2 * landingCanvas.clientWidth - landingCanvas.clientWidth;
		let y = Math.random() * -landingCanvas.clientHeight;
		let v = 10 + Math.random() * 50;
		drops.push(new RainDrop({ x: v, y: v }, { x: x, y: y })); // Creating new drops
	}
}

// Main draw function
function draw() {
	c.fillStyle = bg;
	c.fillRect(0, 0, landingCanvas.width, landingCanvas.height);

	drops.forEach((drop) => {
		drop.update();
		drop.draw();
	});

	requestAnimationFrame(draw);
	// setTimeout(draw, 1000);
}

draw();
