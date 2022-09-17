(() => {
	const stage = document.getElementById("cracks");
	stage.width = innerWidth;
	stage.height = innerHeight;
	stage.style.zIndex = "1";

	const rainCanvas = document.getElementById("rain");

	//function to fade out canvas slowly

	function fadeOut(el) {
		el.style.opacity = 1;
		(function fade() {
			if ((el.style.opacity -= 0.01) < 0.1) {
				el.style.display = "none";
				el.remove();
				stage.remove();
				loadMain();
			} else {
				requestAnimationFrame(fade);
			}
		})();
	}

	let locked = false;

	//resize canvas

	window.addEventListener("resize", () => {
		stage.width = innerWidth;
		stage.height = innerHeight;
	});

	//get x and y pos

	const mouse = {
		x: undefined,
		y: undefined,
	};

	const starting = {
		x: undefined,
		y: undefined,
	};

	window.addEventListener("mousemove", (event) => {
		if (locked) return;
		mouse.x = event.x;
		mouse.y = event.y;
	});

	//onclick

	window.addEventListener("click", (event) => {
		if (!locked) {
			mouse.x = event.x;
			mouse.y = event.y;
			starting.x = event.x;
			starting.y = event.y;
			fadeOut(rainCanvas);
		}
		requestAnimationFrame(update);
	});

	let lastTime = 0;

	const update = (d) => {
		let dt = d - lastTime;
		lastTime = d;

		let randomBool = Math.random() > 0.5 ? true : false;

		// console.log(cracks);
		// console.log(cracks[Math.floor(Math.random() * cracks.length)]);

		let x =
			randomBool && cracks.length
				? cracks[Math.floor(Math.random() * cracks.length)].x /
				  math.randomInteger(1, 2)
				: starting.x;
		let y =
			randomBool && cracks.length
				? cracks[Math.floor(Math.random() * cracks.length)].y
				: starting.y;

		crack(
			x,
			y,
			math.randomInteger(0, stage.width / 0.5),
			1,
			"rgba(255,255,255,0.5)"
		);

		requestAnimationFrame(update);
	};

	let ctx = stage.getContext("2d");

	let cracks = [];

	function crack(x, y, length, width, colour) {
		locked = true;
		// draw a cracked line using random diagonal lines
		// x, y = start point
		// length = length of line
		// width = width of line
		// colour = colour of line

		let angle = Math.random() * Math.PI * 2;

		let x1 = x + Math.cos(angle) * length;

		let y1 = y + Math.sin(angle) * length;

		ctx.beginPath();

		ctx.moveTo(x, y);

		ctx.lineTo(x1, y1);

		ctx.strokeStyle = colour;

		ctx.lineWidth = width;

		ctx.stroke();

		ctx.closePath();

		cracks.push({
			x: x1,
			y: y1,
			length: length,
			width: width,
			colour: colour,
		});
	}
})();
