function loadMain() {
	transition();

	//play an animation of a bright white ball filling the page from the center
	async function transition() {
		const canvas = document.getElementById("transition");
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		canvas.style.zIndex = "99";

		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";

		let startTime = 0;
		const animationTime = 0.5; // seconds
		let fn = function (time) {
			if (startTime) {
				let t = (time - startTime) / 1000;
				if (t > animationTime) {
					t = animationTime;
				}
				let i = (canvas.height * t) / animationTime;
				ctx.beginPath();
				ctx.arc(canvas.width / 2, canvas.height / 2, i, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
				if (t < animationTime) {
					requestAnimationFrame(fn);
				}
			} else {
				// first call to requestAnimationFrame sets the start time
				startTime = time;
				requestAnimationFrame(fn);
			}
		};
		requestAnimationFrame(fn);
	}
}
