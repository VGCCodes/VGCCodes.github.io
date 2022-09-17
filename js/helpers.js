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
