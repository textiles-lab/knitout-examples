#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";


/*
 load an image and build a tubular jacquard from it
 */

if (process.argv.length < 3) {
	console.error("Usage:\n\timage-kp.js <image.png>");
	process.exit(1);
}

const image = process.argv[2];

const Carrier = '7';

const fs = require('fs');
const PNG = require('pngjs').PNG;
const png = PNG.sync.read(fs.readFileSync(image));
const Width = png.width;
const Height = png.height;


console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("x-stitch-number 102"); //WATCH OUT! User-configurable! SUGGEST: 33/26

const min = 1;
const max = Width;

//all-needle cast-on:
function caston() {
	console.log("inhook " + Carrier);
	for (let n = max; n >= min; --n) {
		if ((max-n)%2 == 0) {
			console.log(`knit - f${n} ${Carrier}`);
		}
	}
	for (let n = min; n <= max; ++n) {
		if ((max-n)%2 != 0) {
			console.log(`knit + f${n} ${Carrier}`);
		}
	}

	for (let n = max; n >= min; --n) {
		console.log(`knit - f${n} ${Carrier}`);
	}
	console.log(`releasehook ${Carrier}`);
}


caston();

//after cast-on, all stitches are on front bed:
let bed = [];
for (let n = min; n <= max; ++n) {
	bed.push('f');
}

let dir = "+";

for (let row = 0; row < Height; ++row) {
	//figure out where stitches should be based on the image:
	let targetBed = [];
	for (let c = 0; c < Width; ++c) {
		let col = {
			r:png.data[4*(png.width*(Height-1-row)+c)+0],
			g:png.data[4*(png.width*(Height-1-row)+c)+1],
			b:png.data[4*(png.width*(Height-1-row)+c)+2]
		};
		if (Math.abs(col.r - 255) <= 2 && Math.abs(col.g - 0) <= 2 && Math.abs(col.b - 0) <= 2) {
			targetBed.push('f');
		} else if (Math.abs(col.r - 0) <= 2 && Math.abs(col.g - 255) <= 2 && Math.abs(col.b - 0) <= 2) {
			targetBed.push('b');
		} else {
			console.warn(`Unrecognized color ${col.r}, ${col.g}, ${col.b}.`);
			targetBed.push(bed[c]);
		}
	}

	//move loops that need moving:
	for (let n = min; n <= max; ++n) {
		if (bed[n-min] !== targetBed[n-min]) {
			console.log(`xfer ${bed[n-min]}${n} ${targetBed[n-min]}${n}`);
			bed[n-min] = targetBed[n-min];
		}
	}

	//knit:
	if (dir === '+') {
		for (let n = min; n <= max; ++n) {
			console.log(`knit ${dir} ${bed[n-min]}${n} ${Carrier}`);
		}
		dir = '-';
	} else if (dir === '-') {
		for (let n = max; n >= min; --n) {
			console.log(`knit ${dir} ${bed[n-min]}${n} ${Carrier}`);
		}
		dir = '+';
	}
}

console.log("outhook " + Carrier);

for (let n = min-4; n <= max+4; ++n) {
	console.log("drop f" + n);
}
for (let n = min-4; n <= max+4; ++n) {
	console.log("drop b" + n);
}
