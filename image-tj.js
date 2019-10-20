#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";


/*
 load an image and build a tubular jacquard from it
 */

if (process.argv.length < 3) {
	console.error("Usage:\n\timage-tj.js <image.png>");
	process.exit(1);
}

const image = process.argv[2];

const CarrierA = '3';
const CarrierB = '6';

const fs = require('fs');
const PNG = require('pngjs').PNG;
const png = PNG.sync.read(fs.readFileSync(image));
const Width = png.width;
const Height = png.height;


console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("x-stitch-number 102"); //WATCH OUT! User-configurable! SUGGEST: 33/20

const min = 1;
const max = Width;
let globalRow = 0;
//all-needle cast-on with first carrier:
function caston() {
	let Carrier = CarrierA;
	console.log("inhook " + Carrier);
	for (let n = max; n >= min; --n) {
		if ((max-n)%2 == 0) {
			console.log("knit - f" + n + " " + Carrier);
		} else {
			console.log("knit - b" + n + " " + Carrier);
		}
	}
	for (let n = min; n <= max; ++n) {
		if ((max-n)%2 == 0) {
			console.log("knit + b" + n + " " + Carrier);
		} else {
			console.log("knit + f" + n + " " + Carrier);
		}
	}
	console.log("releasehook " + Carrier);
}
caston();

function band(A,B) {
	console.log("inhook " + B);
	console.log("tuck - f" + (max + 5) + " " + B);
	console.log("tuck - f" + (max + 3) + " " + B);
	console.log("tuck - f" + (max + 1) + " " + B);
	console.log("tuck + f" + (max + 2) + " " + B);
	console.log("tuck + f" + (max + 4) + " " + B);

	console.log("knit - f" + (max + 5) + " " + B);
	console.log("knit - f" + (max + 4) + " " + B);
	console.log("knit - f" + (max + 3) + " " + B);
	console.log("knit - f" + (max + 2) + " " + B);
	console.log("knit - f" + (max + 1) + " " + B);

	console.log("releasehook " + B);

	let dirA = "-";
	let dirB = "-";

	for (let r = 0; r < Height; ++r) {
		let frontA = [];
		let backA = [];
		let frontB = [];
		let backB = [];
		for (let c = 0; c < Width; ++c) {
			frontA.push(false);
			backA.push(false);
			frontB.push(false);
			backB.push(false);
		}
		for (let c = 0; c < Width; ++c) {
			let col = {
				r:png.data[4*(png.width*(Height-1-r)+c)+0],
				g:png.data[4*(png.width*(Height-1-r)+c)+1],
				b:png.data[4*(png.width*(Height-1-r)+c)+2]
			};
			if (col.g === 0 && col.r === 0) {
				frontA[c] = true;
				backB[c] = true;
			} else if (col.g === 255 && col.r === 255) {
				backA[c] = true;
				frontB[c] = true;
			} else if (col.g === 255 && col.r === 0) {
				frontA[c] = true;
				backB[Width-1-c] = true;
			} else if (col.g === 0 && col.r === 255) {
				frontB[c] = true;
				backA[Width-1-c] = true;
			} else {
				console.log("pixel with r=" + col.r + ", g=" + col.g + ", b=" + col.b + " is not understood.");
			}
		}
		console.log("rack 0.25");

		if (dirB === "+") {
			let didB = false;

			for (let n = min; n <= max; ++n) {
				if (frontB[n-min]) {
					console.log("knit + f" + n + " " + B);
					didB = true;
				}
				if (backB[n-min]) {
					console.log("knit + b" + n + " " + B);
					didB = true;
				}
				if (didB && n == max && !(backB[n-min] || frontB[n-min])) {
					console.log("miss + b" + n + " " + B);
				}
			}

			if (didB) dirB = "-";
		} else {
			let didB = false;

			for (let n = max; n >= min; --n) {
				if (backB[n-min]) {
					console.log("knit - b" + n + " " + B);
					didB = true;
				}
				if (frontB[n-min]) {
					console.log("knit - f" + n + " " + B);
					didB = true;
				}
				if (didB && n == min && !(backB[n-min] || frontB[n-min])) {
					console.log("miss - f" + n + " " + B);
				}
			}

			if (didB) dirB = "+";
		}


		if (dirA === "+") {
			let didA = false;

			for (let n = min; n <= max; ++n) {
				if (frontA[n-min]) {
					console.log("knit + f" + n + " " + A);
					didA = true;
				}
				if (backA[n-min]) {
					console.log("knit + b" + n + " " + A);
					didA = true;
				}
				if (didA && n == max && !(backA[n-min] || frontA[n-min])) {
					console.log("miss + b" + n + " " + A);
				}
			}	

			if (didA) dirA = "-";
		} else {
			let didA = false;

			for (let n = max; n >= min; --n) {
				if (backA[n-min]) {
					console.log("knit - b" + n + " " + A);
					didA = true;
				}
				if (frontA[n-min]) {
					console.log("knit - f" + n + " " + A);
					didA = true;
				}
				if (didA && n == min && !(backA[n-min] || frontA[n-min])) {
					console.log("miss - f" + n + " " + A);
				}
			}

			if (didA) dirA = "+";
		}
		console.log("rack 0");

		if (r == 0) {
			console.log("drop f" + (max + 5));
			console.log("drop f" + (max + 4));
			console.log("drop f" + (max + 3));
			console.log("drop f" + (max + 2));
			console.log("drop f" + (max + 1));
		}
	}
	console.log("outhook " + A);
}
band(CarrierA,CarrierB);

console.log("outhook " + CarrierB);
for (let n = min; n <= max; ++n) {
	console.log("drop f" + n);
}
for (let n = min; n <= max; ++n) {
	console.log("drop b" + n);
}
