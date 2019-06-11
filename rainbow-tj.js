#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";


/*
 rainbow tubular jacquard. Each color starts on back bed, fades to front bed, fades back.

 aaaaaaaa
 aabaabaa
 abbababa
 bbabbbab
 bbbbabbb
 bbbbbbbb
 */

const Carriers = ['1','2','3','4','5','6','7','8','9','10','1'];
const Width = 60;
const BandHeight = 40;


//From: https://en.wikipedia.org/wiki/Ordered_dithering
/*
const Dither = [
	[ 0,  8,  2, 10],
	[12,  4, 14,  6],
	[ 3, 11,  1,  9],
	[15,  7, 13,  5],
];
*/
const Dither = [
	[0  , 48 , 12 , 60 ,  3 , 51 , 15 , 63 ],
	[32 , 16 , 44 , 28 , 35 , 19 , 47 , 31 ],
	[8  , 56 ,  4 , 52 , 11 , 59 ,  7 , 55 ],
	[40 , 24 , 36 , 20 , 43 , 27 , 39 , 23 ],
	[2  , 50 , 14 , 62 ,  1 , 49 , 13 , 61 ],
	[34 , 18 , 46 , 30 , 33 , 17 , 45 , 29 ],
	[10 , 58 ,  6 , 54 ,  9 , 57 ,  5 , 53 ],
	[42 , 26 , 38 , 22 , 41 , 25 , 37 , 21 ]
];
for (let r = 0; r < Dither.length; ++r) {
	for (let c = 0; c < Dither[r].length; ++c) {
		Dither[r][c] /= 64.0;
	}
}


console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("x-stitch-number 102");

const min = 1;
const max = Width;
let globalRow = 0;
//all-needle cast-on with first carrier:
function caston() {
	let Carrier = Carriers[0];
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
	for (let r = 0; r < BandHeight; ++r) {
		let DitherRow = Dither[globalRow % Dither.length];
		globalRow += 1;
		let useA = [];
		let value = r / (BandHeight - 1);
		for (let c = 0; c < Width; ++c) {
			useA.push(value + DitherRow[c % DitherRow.length] < 1.0);
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
for (let i = 0; i + 1 < Carriers.length; ++i) {
	band(Carriers[i], Carriers[i+1]);
}

console.log("outhook " + Carriers[Carriers.length-1]);
for (let n = min; n <= max; ++n) {
	console.log("drop f" + n);
}
for (let n = min; n <= max; ++n) {
	console.log("drop b" + n);
}
