const FIXED_STEP = 16;

// Wind
const WIND_VELOCITY = 0.2; // Determines how slanted the rain drops fall, 0 = straight down

// Drop settings
const DROP_COUNT = 500; // Adjust for more/less rain drops
const DROP_WIDTH = 1; // Increase for thicker rain
const DROP_X_BUFFER = 500; // How far to the sides of the screen drops will spawn
const DROP_COLOR = "lightblue";
const DROP_MIN_VELOCITY = 0.6;
const DROP_MAX_VELOCITY = 0.9;
const DROP_MIN_LENGTH = 20;
const DROP_MAX_LENGTH = 40;
const DROP_MIN_ALPHA = 0.3;
const DROP_MAX_ALPHA = 1;

//Frame rate

const fps = 60;

// Math helpers
let math = {
	// Random integer between min and max
	randomInteger: function (min, max) {
		return Math.round(Math.random() * (max - min) + min);
	},
	// Linear Interpolation
	lerp: function (a, b, n) {
		return a + (b - a) * n;
	},
	scaleVector: function (v, s) {
		v.x *= s;
		v.y *= s;
	},
	normalizeVector: function (v) {
		let m = Math.sqrt(v.x * v.x + v.y * v.y);
		math.scaleVector(v, 1 / m);
	},
};

// Initialize our canvas
let stage = document.createElement("canvas");
stage.width = innerWidth;
stage.height = innerHeight;
document.body.appendChild(stage);
let ctx = stage.getContext("2d");

let lastTime = 0;

// Collection of rain drops
let drops = [];

let initDrops = function () {
	for (let i = 0; i < DROP_COUNT; i++) {
		let drop = {};
		resetDrop(drop);
		drop.y = math.randomInteger(0, stage.height);
		drops.push(drop);
	}
};

// Reset a drop to the top of the canvas
let resetDrop = function (drop) {
	let scale = Math.random();
	drop.x = math.randomInteger(-DROP_X_BUFFER, stage.width + DROP_X_BUFFER);
	drop.vx = WIND_VELOCITY;
	drop.vy = math.lerp(DROP_MIN_VELOCITY, DROP_MAX_VELOCITY, scale);
	drop.l = math.lerp(DROP_MIN_LENGTH, DROP_MAX_LENGTH, scale);
	drop.a = math.lerp(DROP_MIN_ALPHA, DROP_MAX_ALPHA, scale);
	drop.y = math.randomInteger(-drop.l, 0);
};

let updateDrops = function (dt) {
	for (let i = drops.length - 1; i >= 0; --i) {
		let drop = drops[i];
		drop.x += drop.vx * dt;
		drop.y += drop.vy * dt;

		if (drop.y > stage.height + drop.l) {
			resetDrop(drop);
		}
	}
};

let renderDrops = function (ctx) {
	ctx.save();
	ctx.strokeStyle = DROP_COLOR;
	ctx.lineWidth = DROP_WIDTH;
	ctx.compositeOperation = "lighter";

	for (let i = 0; i < drops.length; ++i) {
		let drop = drops[i];

		let x1 = Math.round(drop.x);
		let y1 = Math.round(drop.y);

		let v = { x: drop.vx, y: drop.vy };
		math.normalizeVector(v);
		math.scaleVector(v, -drop.l);

		let x2 = Math.round(x1 + v.x);
		let y2 = Math.round(y1 + v.y);

		ctx.globalAlpha = drop.a;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	}
	ctx.restore();
};

let render = function () {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, stage.width, stage.height);
	renderDrops(ctx);
};

function FpsCtrl(fps, callback) {
	let delay = 1000 / fps, // calc. time per frame
		time = null, // start time
		frame = -1, // frame count
		tref; // rAF time reference

	function loop(timestamp) {
		if (time === null) time = timestamp; // init start time
		let seg = Math.floor((timestamp - time) / delay); // calc frame no.
		if (seg > frame) {
			// moved to next frame?
			frame = seg; // update
			callback({
				// callback function
				time: timestamp,
				frame: frame,
			});
		}
		tref = requestAnimationFrame(loop);
	}

	// play status
	this.isPlaying = false;

	// set frame-rate
	this.frameRate = function (newfps) {
		if (!arguments.length) return fps;
		fps = newfps;
		delay = 1000 / fps;
		frame = -1;
		time = null;
	};

	// enable starting/pausing of the object
	this.start = function () {
		if (!this.isPlaying) {
			this.isPlaying = true;
			tref = requestAnimationFrame(loop);
		}
	};

	this.pause = function () {
		if (this.isPlaying) {
			cancelAnimationFrame(tref);
			this.isPlaying = false;
			time = null;
			frame = -1;
		}
	};
}

initDrops();

const fpsCtrl = new FpsCtrl(fps, (data) => {
	let dt = data.time - lastTime;
	lastTime = data.time;
	if (dt > 100) {
		dt = FIXED_STEP;
	}

	while (dt >= FIXED_STEP) {
		updateDrops(FIXED_STEP);
		dt -= FIXED_STEP;
	}

	render();
});

fpsCtrl.start();
