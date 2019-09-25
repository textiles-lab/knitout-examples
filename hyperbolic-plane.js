#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"


//start a wide rectangle that shrinks at a given rate

const StartWidth = 100;
const ShrinkEvery = 11;
const MaxHeight = 50;
const Carrier = "3";


console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

//Alternating tucks cast-on:

console.log("inhook " + Carrier);

console.log("x-stitch-number 61"); //in our table: "Half / Wrap" for Polo

let min = 1;
let max = min + StartWidth - 1;

for (let n = max; n >= min; --n) {
	if ((max-n) % 2 == 0) {
		console.log("tuck - f" + n + " " + Carrier);
	}
}
for (let n = min; n <= max; ++n) {
	if ((max-n)%2 == 1) {
		console.log("tuck + f" + n + " " + Carrier);
	}
}

console.log("miss + f" + max + " " + Carrier);

console.log("releasehook " + Carrier);

// Rows of plain knitting:
console.log("x-stitch-number 63"); //in our table: "Knitting" for Polo


let decreaseAccum = 0;
function decrease(from,to) {
	//transfer beds front-to-back and do decreases every 'ShrinkEvery' stitches:
	let offsets = [];
	let ofs = 0;
	//consider each gap between stitches:
	for (let n = min; n < max; ++n) {
		offsets.push(ofs);
		if (decreaseAccum === ShrinkEvery) {
			ofs -= 1;
			decreaseAccum = 0;
		}
		decreaseAccum += 1;
	}
	offsets.push(ofs);

	let mid = Math.max(offsets[Math.floor(offsets.length/2)],-8);
	for (let i = 0; i < offsets.length; ++i) {
		offsets[i] -= mid;
	}

	//schoolbus, more-or-less:
	let i = 0;
	let base = 0;
	while (i < offsets.length) {
		console.log("; Base: " + base + " offsets [" + offsets.join(" ") + "]"); //DEBUG
		//resolve the block from base-8 to base+8
		for (let d = 8; d >= -8; --d) {
			if (offsets[i] === base+d) {
				console.log("rack " + (from === 'b' ? d : -d));
				while (i < offsets.length && offsets[i] === base+d) {
					console.log("xfer " + from + (min+i+base) + " " + to + (min+i+offsets[i]));
					++i;
				}
			} else {
				if (offsets[i] > d) {
					throw new Error("Offset " + offsets[i] + " thing at d " + d + " and base " + base);
				}
			}
		}
		if (i < offsets.length) {
			let d = -8;
			console.log("; Reset to " + (base+d+d)); //DEBUG
			console.log("rack " + (from === 'b' ? d : -d));
			for (let j = i; j < offsets.length; ++j) {
				console.log("xfer " + from + (min+j+base) + " " + to + (min+j+base+d));
			}
			console.log("rack " + (to === 'b' ? d : -d));
			for (let j = i; j < offsets.length; ++j) {
				console.log("xfer " + to + (min+j+base+d) + " " + from + (min+j+base+d+d));
			}
			base += d+d;
		}
	}
	min += offsets[0];
	max += offsets[offsets.length-1];
	console.log(";Min: " + min + " max: " + max); //DEBUG
}

for (let r = 0; r < MaxHeight; ++r) {
	if (r % 2 == 0) {
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Carrier);
		}
		decrease('f','b');
	} else {
		for (let n = min; n <= max; ++n) {
			console.log("knit + b" + n + " " + Carrier);
		}
		decrease('b','f');
	}
	if (max - min + 1 < 6) {
		console.error("Got too small at " + r + " rows.");
		break;
	}
}

console.log("outhook " + Carrier);
