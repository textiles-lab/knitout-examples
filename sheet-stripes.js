#!/usr/bin/env node

//Sheet with wide stripes, designed with making an electrode matrix in mind.

const Background = 3;
const Conductive = 5;

//heights should all be even:
const BackgroundHeight = 4;
const ConductiveHeight = 10;
const MarginHeight = 10;

const Width = 20;
const Stripes = 6;

const min = 1;
const max = min + Width - 1;

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

//alternating tucks cast-on:
console.log("inhook " + Background);
for (let n = max; n >= min; --n) {
	if ((max - n) % 2 == 0) {
		console.log("tuck - f" + n + " " + Background);
	}
}
for (let n = min; n <= max; ++n) {
	if ((max - n) % 2 == 1) {
		console.log("tuck + f" + n + " " + Background);
	}
}
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + Background);
}
console.log("releasehook " + Background);

//bring in conductive and knit a row:
console.log("inhook " + Conductive);
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + Conductive);
}
console.log("releasehook " + Conductive);

//----------------------

//Margin (start):
for (let r = 0; r < MarginHeight; r += 2) {
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Background);
	}
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Background);
	}
}

//stripes:
for (let stripe = 0; stripe < Stripes; ++stripe) {
	for (let r = 0; r < ConductiveHeight; r += 2) {
		for (let n = min; n <= max; ++n) {
			console.log("knit + f" + n + " " + Conductive);
		}
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Conductive);
		}
	}
	if (stripe + 1 < Stripes) {
		for (let r = 0; r < BackgroundHeight; r += 2) {
			for (let n = min; n <= max; ++n) {
				console.log("knit + f" + n + " " + Background);
			}
			for (let n = max; n >= min; --n) {
				console.log("knit - f" + n + " " + Background);
			}
		}
	}
}

console.log("outhook " + Conductive);

//Margin (end):
for (let r = 0; r < MarginHeight; r += 2) {
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Background);
	}
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Background);
	}
}
console.log("outhook " + Background);
