#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

let width = 30;
let height = 10;


console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

console.log("inhook 3");

let min = 1;
let max = min + width - 1;

for (let n = max; n >= min; --n) {
	if ((max-n) % 2 == 0) {
		console.log("tuck - f" + n + " 3");
	}
}
for (let n = min; n <= max; ++n) {
	if ((max-n)%2 == 1) {
		console.log("tuck + f" + n + " 3");
	}
}

console.log("miss + f" + max + " 3");

console.log("releasehook 3");

console.log("x-stitch-number 40");

for (let r = 0; r < height; ++r) {
	if (r % 2 == 0) {
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " 3");
		}
	} else {
		for (let n = min; n <= max; ++n) {
			console.log("knit + f" + n + " 3");
		}
	}
}

console.log("outhook 3");
