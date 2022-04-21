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

const StartLoops = 30; //counted from example
const StartRows = 30; //counted from example

const EndLoops = 22; //counted from example
const EndRows = 26; //counted from example

const Carrier = 3;

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

//tube layout:
//  back:  o o o  <--back is on 2*n+1
// front: o o o   <--front is on 2*n

//helper to translate to half-gauge:
function loc(bed, n) {
	return bed + (bed === 'f' ? 2*n : 2*n+1);
}

let min = 1;
let max = StartLoops;

console.log(`inhook ${Carrier}`);

console.log(`x-stitch-number 77`); //"50/50 @ Half / All-Needle"

//alternating front/back cast-on:
console.log(`rack -2`);
for (let n = max; n >= min; --n) {
	console.log(`tuck - ${loc('f', n)} ${Carrier}`);
	console.log(`tuck - ${loc('b', n)} ${Carrier}`);
}
console.log(`miss - f${2*min-2} ${Carrier}`);

console.log(`rack 0`);
for (let n = min; n <= max; ++n) {
	console.log(`knit + ${loc('f', n)} ${Carrier}`);
	console.log(`knit + ${loc('b', n)} ${Carrier}`);
}
console.log(`releasehook ${Carrier}`);


console.log(`x-stitch-number 78`); //"50/50 @ Half / Knitting"

function knitRow() {
	for (let n = max; n >= min; --n) {
		console.log(`knit - ${loc('f', n)} ${Carrier}`);
	}
	for (let n = min; n <= max; ++n) {
		console.log(`knit + ${loc('b', n)} ${Carrier}`);
	}
}

for (let row = 0; row < StartRows; ++row) {
	knitRow();
}

function decrease() {
	const inset = Math.round((max+1-min) * 0.25);
	console.warn(`inset is ${inset}`);
	for (let n = min; n < min + inset; ++n) {
		console.log(`xfer f${n*2} b${n*2}`);
	}
	console.log(`rack +2`);
	for (let n = min; n < min + inset; ++n) {
		console.log(`xfer b${n*2+1} f${(n+1)*2+1}`);
		console.log(`xfer b${n*2} f${(n+1)*2}`);
	}
	console.log(`rack 0`);
	for (let n = min; n < min + inset; ++n) {
		console.log(`xfer f${(n+1)*2+1} b${(n+1)*2+1}`);
	}
	for (let n = max; n > max - inset; --n) {
		console.log(`xfer f${n*2} b${n*2}`);
	}
	console.log(`rack -2`);
	for (let n = max; n > max - inset; --n) {
		console.log(`xfer b${n*2} f${(n-1)*2}`);
		console.log(`xfer b${n*2+1} f${(n-1)*2+1}`);
	}
	console.log(`rack 0`);
	for (let n = max; n > max - inset; --n) {
		console.log(`xfer f${(n-1)*2+1} b${(n-1)*2+1}`);
	}
	min += 1;
	max -= 1;
}

function shortRows(turns) {
	//next stitch to make:
	let n = max;
	let b = 'f';
	let d = '-';
	//walk to next stitch position around the tube:
	function step() {
		if (d == '-') {
			if (n === min) {
				d = '+';
				b = (b == 'f' ? 'b' : 'f');
			} else {
				n -= 1;
			}
		} else { //d == '+'
			if (n === max) {
				d = '-';
				b = (b == 'f' ? 'b' : 'f');
			} else {
				n += 1;
			}
		}
	}
	function knit() {
		console.log(`knit ${d} ${loc(b,n)} ${Carrier}`);
		step();
	}
	function tuck_and_turn() {
		console.log(`tuck ${d} ${loc(b,n)} ${Carrier}`);
		d = (d == '+' ? '-' : '+');
		step();
	}
	for (const turn of turns) {
		while (n != turn.n || b != turn.b) {
			knit();
		}
		tuck_and_turn();
	}
	//finish last row:
	do {
		knit();
	} while (!(n == max && b == 'f'));
}

while ((max+1-min) > EndLoops) {
	decrease();
	knitRow();
	shortRows([
		{b:'b', n:Math.round(0.7*(max-min)+min)},
		{b:'b', n:Math.round(0.3*(max-min)+min)},
		{b:'b', n:Math.round(0.65*(max-min)+min)},
		{b:'b', n:Math.round(0.35*(max-min)+min)},
		{b:'b', n:max},
		{b:'b', n:min+1},
		{b:'f', n:Math.round(0.65*(max-min)+min)},
		{b:'f', n:Math.round(0.35*(max-min)+min)},
	]);
	knitRow();
}

//ending tube:
for (let row = 0; row < EndRows; ++row) {
	knitRow();
}

//bind-off (front):
for (let n = max; n > min; --n) {
	console.log(`knit - ${loc('f',n)} ${Carrier}`);
	console.log(`miss - ${loc('f',n-1)} ${Carrier}`);
	console.log(`xfer ${loc('f',n)} b${n*2}`);
	console.log(`rack -2`);
	console.log(`xfer b${n*2} ${loc('f',n-1)}`);
	console.log(`rack 0`);
}

//leftmost front stitch:
console.log(`knit - ${loc('f',min)} ${Carrier}`);
console.log(`tuck - ${loc('f',min-1)} ${Carrier}`); //extra loop to help hold things up
console.log(`rack -1`);
console.log(`xfer ${loc('f',min)} ${loc('b',min)}`);
console.log(`rack 0`);

//bind-off (back):
for (let n = min; n < max; ++n) {
	console.log(`knit + ${loc('b',n)} ${Carrier}`);
	console.log(`miss + ${loc('b',n+1)} ${Carrier}`);
	console.log(`xfer ${loc('b',n)} f${n*2+1}`);
	console.log(`rack -2`);
	console.log(`xfer f${n*2+1} ${loc('b',n+1)}`);
	console.log(`rack 0`);
}

//tag (on back -- though classic tag is on the front):
console.log(`knit + ${loc('b',max)} ${Carrier}`);
console.log(`knit - ${loc('b',max)} ${Carrier}`);
console.log(`knit + ${loc('b',max)} ${Carrier}`);
console.log(`knit - ${loc('b',max)} ${Carrier}`);
console.log(`tuck - ${loc('b',max-1)} ${Carrier}`);
console.log(`tuck + ${loc('b',max-2)} ${Carrier}`);
console.log(`knit + ${loc('b',max-1)} ${Carrier}`);
console.log(`knit + ${loc('b',max)} ${Carrier}`);
for (let r = 0; r < 4; ++r) {
	for (let n = max; n >= max-2; --n) {
		console.log(`knit - ${loc('b',n)} ${Carrier}`);
	}
	for (let n = max-2; n <= max; ++n) {
		console.log(`knit + ${loc('b',n)} ${Carrier}`);
	}
}

console.log(`outhook ${Carrier}`);
