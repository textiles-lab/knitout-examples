#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//Parameters:

const Width = 30;
const Height = 40;
const Carrier = "3";

//Operation:

//Makes a Width x Height rectangle of plain "interlock" knitting
// basically, rows alternate front/back on each needle.

//Doesn't require a cast-on.


console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

let min = 1;
let max = min + Width - 1;

function knitTwoRows() {
	for (let n = max; n >= min; --n) {
		let bed = ((max - n) % 2 == 0 ? 'f' : 'b');
		console.log("knit - " + bed + n + " " + Carrier);
	}
	for (let n = min; n <= max; ++n) {
		let bed = ((max - n) % 2 == 0 ? 'b' : 'f');
		console.log("knit + " + bed + n + " " + Carrier);
	}
}


console.log("x-stitch-number 63"); //in our table: "Knitting" for Polo

// Get carrier in:
console.log("inhook " + Carrier);
knitTwoRows();
console.log("releasehook " + Carrier);

// Finish the remaining rows:
for (let r = 2; r < Height; r += 2) {
	knitTwoRows();
}

// Take carrier out:
console.log("outhook " + Carrier);
