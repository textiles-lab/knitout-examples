#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";


/*
 load an image and build a lace pattern from it
 */

if (process.argv.length < 3) {
	console.error("Usage:\n\timage-lace.js <image.png>");
	process.exit(1);
}

const image = process.argv[2];

const Carriers = {
	'Background':'8',
	'Insert':['6','7'],
};

const fs = require('fs');
const PNG = require('pngjs').PNG;
const png = PNG.sync.read(fs.readFileSync(image));
const Width = png.width;
const Height = png.height;

console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

function caston_stitch() {
	console.log("x-stitch-number 102");
}

function lace_stitch() {
	console.log("x-stitch-number 103");
}

const min = 1;
const max = Width;

//all-needle cast-on:
function caston(Carrier) {
	caston_stitch();

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


caston(Carriers.Background);

lace_stitch();

function toHex(r,g,b) {
	r = Math.max(0, Math.min(255, Math.round(r)));
	g = Math.max(0, Math.min(255, Math.round(g)));
	b = Math.max(0, Math.min(255, Math.round(b)));

	r = r.toString(16).padStart(2,'0');
	g = g.toString(16).padStart(2,'0');
	b = b.toString(16).padStart(2,'0');

	return r + g + b;
}

let dir = "+";

let unrecognized = {};

for (let row = 0; row < Height; ++row) {
	//figure out target offsets + beds based on the image:
	let targets = [];
	for (let c = 0; c < Width; ++c) {
		let col = {
			r:png.data[4*(png.width*(Height-1-row)+c)+0],
			g:png.data[4*(png.width*(Height-1-row)+c)+1],
			b:png.data[4*(png.width*(Height-1-row)+c)+2]
		};
		let hcol = toHex(col.r, col.g, col.b);
		if        (hcol === "008800") {
			targets.push(0);
		} else if (hcol === "880000") {
			targets.push(-1);
		} else if (hcol === "000088") {
			targets.push(+1);
		} else {
			if (!(hcol in unrecognized)) {
				console.warn(`Unrecognized color ${hcol}.`);
				unrecognized[hcol] = 0;
			}
			unrecognized[hcol] += 1;
			targets.push(0);
		}
	}

	//move loops that need moving:
	for (let n = min; n <= max; ++n) {
		if (targets[n-min] === -1) {
			console.log(`xfer f${n} b${n}`);
		}
	}
	console.log('rack -1');
	for (let n = min; n <= max; ++n) {
		if (targets[n-min] === -1) {
			console.log(`xfer b${n} f${n-1}`);
		} else if (targets[n-min] === 1) {
			console.log(`xfer f${n} b${n+1}`);
		}
	}
	console.log('rack 0');
	for (let n = min; n <= max; ++n) {
		if (targets[n-min] === 1) {
			console.log(`xfer b${n+1} f${n+1}`);
		}
	}

	//knit:
	if (dir === '+') {
		for (let n = min; n <= max; ++n) {
			console.log(`knit ${dir} f${n} ${Carriers.Background}`);
		}
		dir = '-';
	} else if (dir === '-') {
		for (let n = max; n >= min; --n) {
			console.log(`knit ${dir} f${n} ${Carriers.Background}`);
		}
		dir = '+';
	}
}

console.log("outhook " + Carriers.Background);

for (let n = min-4; n <= max+4; ++n) {
	console.log("drop f" + n);
}
for (let n = min-4; n <= max+4; ++n) {
	console.log("drop b" + n);
}
