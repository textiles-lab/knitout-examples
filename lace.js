#!/usr/bin/env node

//basic left/right transfer-based lace:

const Carrier = "6";

//'-' is move stitches left, '+' is move stitches right
const Pattern = [
	"..--.....+..",
	"...-....--..",
	"...++....-..",
	"...+.....++.",
];

const Width = Pattern[0].length * 4;
const Height = Pattern.length * 4;

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");


//Basic alternating tucks cast-on:
console.log('inhook ' + Carrier);
for (let n = Width-1; n >= 0; --n) {
	if ((Width-1 - n) % 2 === 0) {
		console.log('knit - f' + n + ' ' + Carrier);
	}
}
for (let n = 0; n <= Width-1; ++n) {
	if ((Width-1 - n) % 2 !== 0) {
		console.log('knit + f' + n + ' ' + Carrier);
	}
}

//'dir' will track the direction of the next pass:
let dir = '-';
function knitRow() {
	if (dir === '+') {
		for (let n = 0; n < Width; ++n) {
			console.log('knit + ' + 'f' + n + ' ' + Carrier);
		}
		dir = '-';
	} else { //dir === '-'
		for (let n = Width-1; n >= 0; --n) {
			console.log('knit - ' + 'f' + n + ' ' + Carrier);
		}
		dir = '+';
	}
}

//a few starting rows:
for (let r = 0; r < 4; ++r) {
	knitRow();
}

console.log('releasehook ' + Carrier);

//run the pattern:
for (let rowIndex = 0; rowIndex < Height; ++rowIndex) {
	//duplicate pattern row to get full-width row:
	const patternRow = Pattern[(Height - 1 - rowIndex) % Pattern.length];
	let row = "";
	for (let col = 0; col < Width; ++col) {
		row += patternRow[col % patternRow.length];
	}
	console.warn(row); //DEBUG

	//handle transfers indicated in the pattern:
	for (let n = 0; n < Width; ++n) {
		console.log('xfer f' + n + ' b' + n);
	}
	console.log('rack +1');
	for (let n = 0; n < Width; ++n) {
		if (row[n] === '+') {
			console.log('xfer b' + n + ' f' + (n+1));
		}
	}
	console.log('rack -1');
	for (let n = 0; n < Width; ++n) {
		if (row[n] === '-') {
			console.log('xfer b' + n + ' f' + (n-1));
		}
	}
	console.log('rack 0');
	for (let n = 0; n < Width; ++n) {
		if (row[n] === '.') {
			console.log('xfer b' + n + ' f' + n);
		}
	}

	//knit a row:
	knitRow();
}

//a few ending rows:
for (let r = 0; r < 4; ++r) {
	knitRow();
}

//finish up with yarn:
console.log('outhook ' + Carrier);

//drop:
for (let n = 0; n < Width; ++n) {
	console.log('drop ' + 'f' + n);
}
