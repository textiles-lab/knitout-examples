#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//Our lab mascot: the J-30 (knitout re-implementation)

//J-30 is a half-gauge tube with a closed cast-on that features mixed narrowing and short-rows.
//It is meant to be knitted with Yeoman Yarns' 50/50 in the "Rust" color.


//             ||  <-- small tag
//             ||
//    endLoops /
//    xxxxxxxxx    <-- open bind-off
//    |||||||||
//    ||||||||| <-- endRows
//    |||||||||
//
//       ...
//       
//  ||||||||||||||   <-- inset decreases and short rows (on the back bed)
// ///||||||||||\\\
// ||||||||||||||||
// |||||||||||||||| <-- startRows
// ||||||||||||||||
// xxxxxxxxxxxxxxxx <-- closed cast-on
//   startLoops

const startLoops = 30; //counted from example
const startRows = 30; //approximate

const endLoops = 22; //counted from example
const endRows = 30; //approximate

const carrier = 3;

let knitout = [];
function k(s) { knitout.push(s); }

k(";!knitout-2");
k(";!Carriers: 1 2 3 4 5 6 7 8 9 10");

//tube layout:
//  back: o o o  <--back is on 2*n-1
// front:  o o o <--front is on 2*n

//helper to translate to half-gauge:
function loc(bed, n) {
	return bed + ((bed === 'f' ? 2*n : 2*n-1);
}

let min = 1;
let max = startLoops;

k("inhook " + carrier);

k("x-stitch-number 77"); //"50/50 @ Half / All-Needle"

//alternating front/back cast-on:
for (let n = max; n >= min; --n) {
	k("knit - " + loc('f', n));
	k("knit - " + loc('b', n));
}

//return to the RHS:
for (let n = min; n <= max; ++n) {
	k("knit + " + loc('f', n));
}

k("x-stitch-number 78"); //"50/50 @ Half / Knitting"

function knitRow() {
	for (let n = max; n >= min; --n) {
		k("knit - " + loc('b', n));
	}
	for (let n = min; n <= max; ++n) {
		k("knit + " + loc('f', n));
	}
}

for (let row = 0; row < startRows; ++row) {
	knitRow();
}

function decrease() {
	
}
