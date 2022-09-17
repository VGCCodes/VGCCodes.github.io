(() => {
	// Wind
	const WIND_VELOCITY = 0.2; // Determines how slanted the rain drops fall, 0 = straight down

	// Drop settings
	const DROP_COUNT = 500; // Adjust for more/less rain drops
	const DROP_WIDTH = 1; // Increase for thicker rain
	const DROP_X_BUFFER = 500; // How far to the sides of the screen drops will spawn
	const DROP_COLOR = "lightblue";
	const DROP_MIN_VELOCITY = 0.9;
	const DROP_MAX_VELOCITY = 1.8;
	const DROP_MIN_LENGTH = 20;
	const DROP_MAX_LENGTH = 40;
	const DROP_MIN_ALPHA = 0.3;
	const DROP_MAX_ALPHA = 1;

	// Collection of rain drops
	let drops = [];

	// Initialize our canvas
	let stage = document.getElementById("rain");
	stage.width = innerWidth;
	stage.height = innerHeight;
	stage.style.zIndex = "0";

	let ctx = stage.getContext("2d");

	// Resize canvas and restart simulation

	window.addEventListener("resize", () => {
		stage.width = innerWidth;
		stage.height = innerHeight;
		drops = [];
		run();
	});

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

	let lastTime = 0;

	let update = function (d) {
		let dt = d - lastTime;
		lastTime = d;

		updateDrops(dt);
		ctx.clearRect(0, 0, stage.width, stage.height);
		renderDrops(ctx);
		requestAnimationFrame(update);
	};

	let run = function () {
		initDrops();
		ctx.clearRect(0, 0, stage.width, stage.height);
		renderDrops(ctx);
		requestAnimationFrame(update);
	};

	run();
})();
