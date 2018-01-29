#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

let min = 1;
let max = 20;

let Carrier = 5;

console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("inhook " + Carrier);

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


for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + Carrier);
}

console.log("releasehook " + Carrier);

let rows = 20;

for (let row = 0; row < rows; ++row) {

	if (row != 0) {
		console.log("miss - f" + (min-1) + " " + Carrier);
		for (let n = max; n >= min; --n) {
			console.log("xfer f" + n + " b" + n);
		}
		console.log("rack -1");
		for (let n = max; n >= min; --n) {
			console.log("xfer b" + n + " f" + (n-1));
		}
		console.log("rack 0");
		min -= 1;
		max -= 1;
	}

	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier);
	}
	console.log("tuck + f" + (max+1) + " " + Carrier);

	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Carrier);
	}
}

let old_max = max;
let old_min = min;

max += rows;
for (let n = min; n <= max; ++n) {
	console.log("knit + f" + n + " " + Carrier);
}
min += rows;

for (let n = old_min; n <= old_max; ++n) {
	console.log("drop f" + n);
}
for (let row = 0; row < rows; ++row) {
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Carrier);
	}
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier);
	}
}

console.log("outhook " + Carrier);
