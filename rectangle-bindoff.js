#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//Parameters:

/* on our machine, this is a (big) 12x24"-ish rectangle:
const Width = 240;
const Height = 740; 
const Carrier = "7";
const CastOnStitch = 91; // stitch: 25 / leading: 20
const KnittingStitch = 109; // user-defined(!)
*/

//Settings for a small test rectangle:
const Width = 30;
const Height = 40;
const Carrier = "3";
const CastOnStitch = 61; //in our table: "Half / Wrap" for Polo
const KnittingStitch = 63; //in our table: "Knitting" for Polo
const DoBindOff = true;

//Operation:

//Makes a Width x Height rectangle of plain knitting on the front bed with carrier Carrier.
//Uses an alternating-tucks cast-on.

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

console.log("x-presser-mode auto");

//Alternating tucks cast-on:

console.log("inhook " + Carrier);

console.log("x-stitch-number " + CastOnStitch);

let min = 1;
let max = min + Width - 1;

for (let n = max; n >= min; --n) {
	if ((max-n) % 2 === 0) {
		console.log("tuck - f" + n + " " + Carrier);
	}
}
for (let n = min; n <= max; ++n) {
	if ((max-n)%2 === 1) {
		console.log("tuck + f" + n + " " + Carrier);
	}
}

console.log("miss + f" + max + " " + Carrier);

console.log("releasehook " + Carrier);

// Rows of plain knitting:
console.log("x-stitch-number " + KnittingStitch);

for (let r = 0; r < Height; ++r) {
	if (r % 2 === 0) {
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Carrier);
		}
	} else {
		for (let n = min; n <= max; ++n) {
			console.log("knit + f" + n + " " + Carrier);
		}
	}
}

//Basic stack bind-off:
if (DoBindOff) {
	if ((Height - 1) % 2 === 1) {
		console.warn("NOTE: adding an extra row so that bind off can work to the right.");
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Carrier);
		}
	}
	for (let n = min; n < max; ++n) {
		console.log("xfer f" + n + " b" + n);
		console.log("rack 1.0");
		console.log("xfer b" + n + " f" + (n+1));
		console.log("rack 0.25");
		if ((n-min) % 2 === 1) {
			console.log("tuck + b" + n + " " + Carrier);
		}
		console.log("knit + f" + (n+1) + " " + Carrier);
		if (n+2 <= max) {
			console.log("miss + f" + (n+2) + " " + Carrier);
		}
		console.log("rack 0.0");
	}
	console.log("knit - f" + max + " " + Carrier);
	console.log("knit + f" + max + " " + Carrier);
	console.log("knit - f" + max + " " + Carrier);
	console.log("knit + f" + (max-1) + " " + Carrier);
	console.log("knit + f" + max + " " + Carrier);
	console.log("knit - f" + max + " " + Carrier);
	console.log("knit - f" + (max-1) + " " + Carrier);
	console.log("knit + f" + (max-2) + " " + Carrier);
	console.log("knit + f" + (max-1) + " " + Carrier);
	console.log("knit + f" + max + " " + Carrier);
	console.log("knit - f" + max + " " + Carrier);
	console.log("knit - f" + (max-1) + " " + Carrier);
	console.log("knit - f" + (max-2) + " " + Carrier);
	console.log("knit + f" + (max-3) + " " + Carrier);
	console.log("knit + f" + (max-2) + " " + Carrier);
	console.log("knit + f" + (max-1) + " " + Carrier);
	console.log("knit + f" + max + " " + Carrier);

	for (let r = 0; r < 4; ++r) {
		console.log("knit - f" + max + " " + Carrier);
		console.log("knit - f" + (max-1) + " " + Carrier);
		console.log("knit - f" + (max-2) + " " + Carrier);
		console.log("knit - f" + (max-3) + " " + Carrier);
		console.log("knit + f" + (max-3) + " " + Carrier);
		console.log("knit + f" + (max-2) + " " + Carrier);
		console.log("knit + f" + (max-1) + " " + Carrier);
		console.log("knit + f" + max + " " + Carrier);

	}
}

console.log("outhook " + Carrier);

//drop the loops:
if (!DoBindOff) {
	for (let n = min; n <= max; ++n) {
		console.log("drop f" + n);
	}
} else {
	console.log("rack 0.25");
	for (let n = min; n <= max; ++n) {
		console.log("drop b" + n);
		console.log("drop f" + n);
	}
}
