#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//Parameters:

const Width = 30;
const Height = 40;
const Carrier = "3";

//Operation:

//Makes a Width x Height rectangle of plain knitting on the front bed with carrier Carrier.
//Uses an alternating-tucks cast-on.



console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

//Alternating tucks cast-on:

console.log("inhook " + Carrier);

console.log("x-stitch-number 61"); //in our table: "Half / Wrap" for Polo

let min = 1;
let max = min + Width - 1;

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

for (let r = 0; r < Height; ++r) {
	if (r % 2 == 0) {
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Carrier);
		}
	} else {
		for (let n = min; n <= max; ++n) {
			console.log("knit + f" + n + " " + Carrier);
		}
	}
}

console.log("outhook " + Carrier);
