#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";


/*
 load an image and build a tubular jacquard from it
 */

const CarrierA = '3';
const CarrierB = '6';

const fs = require('fs');
const PNG = require('pngjs').PNG;
const png = PNG.sync.read(fs.readFileSync('image-tj.png'));
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
	for (let r = 0; r < Height; ++r) {
		let useA = [];
		for (let c = 0; c < Width; ++c) {
			if (png.data[4*(png.width*(Height-1-r)+c)] > 128) {
				useA.push(true);
			} else {
				useA.push(false);
			}
		}
		if (r % 2 == 0) {
			//B row:
			for (let n = max; n >= min; --n) {
				console.log("knit - " + (useA[n-min] ? "b" : "f") + n + " " + B);
			}

			//A row:
			for (let n = max; n >= min; --n) {
				console.log("knit - " + (useA[n-min] ? "f" : "b") + n + " " + A);
			}
		} else {
			//B row:
			for (let n = min; n <= max; ++n) {
				console.log("knit + " + (useA[n-min] ? "b" : "f") + n + " " + B);
			}

			//A row:
			for (let n = min; n <= max; ++n) {
				console.log("knit + " + (useA[n-min] ? "f" : "b") + n + " " + A);
			}
		}

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
