//title: Sheet I-Cord Cast-On (plain javascript)
// Casts on a sheet by knitting a small tube, leaving one stitch on the bed each time; slow but fancy.

//Write header:
console.log(';!knitout-2');
console.log(';;Machine: SWGN2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');

//Parameters:
const min = 1; //needle number of left edge
const max = 20; //needle number of right edge
const carrier = "3"; //carrier name
const cordWidth = 4; //cord width
const rows = 20;

//Bring in carrier:
console.log(`inhook ${carrier}`);
//Set stitch table entry for cast-on:
console.log(`x-stitch-number 101`);

//On SWGN2 machines, carriers start on the right,
//so will start by making a closed tube bind-off for the cord on the right.

//All-needle closed-tube cast-on, with carrier ending on the left:
console.log(`rack -0.75`);
for (let n = max; n >= max - cordWidth; n -= 1) {
	console.log(`tuck - f${n} ${carrier}`);
	console.log(`tuck - b${n} ${carrier}`);
}
console.log(`rack 0`);

//Set stitch table entry for knitting:
console.log(`x-stitch-number 105`);

//Knit a small tube, leaving an extra stitch to the right and moving the stitches every course:
//Start first course of the tube:
for (let n = max - cordWidth; n <= max; n += 1) {
	console.log(`knit + f${n} ${carrier}`);
}
//send out yarn inserting hook; it is no longer needed to hold the yarn in place:
console.log(`releasehook ${carrier}`);
//Middle of tube:
for (let tubeMax = max; tubeMax >= min; tubeMax -= 1) {
	for (let n = tubeMax; n >= tubeMax - cordWidth; n -= 1) {
		console.log(`knit - b${n} ${carrier}`);
	}
	console.log(`miss - b${(tubeMax-cordWidth-1)} ${carrier}`);
	for (let n = tubeMax - cordWidth; n <= tubeMax; n += 1) {
		console.log(`xfer f${n} bs${n}`);
	}
	console.log(`rack -1`);
	for (let n = tubeMax - cordWidth; n <= tubeMax; n += 1) {
		console.log(`xfer bs${n} f${(n-1)}`);
	}
	console.log(`rack 0`);
	for (let n = tubeMax - cordWidth; n <= tubeMax; n += 1) {
		console.log(`knit + f${(n-1)} ${carrier}`);
	}
	console.log(`tuck + f${tubeMax} ${carrier}`);
	for (let n = tubeMax - cordWidth; n <= tubeMax; n += 1) {
		console.log(`xfer b${n} fs${n}`);
	}
	console.log(`rack 1`);
	for (let n = tubeMax - cordWidth; n <= tubeMax; n += 1) {
		console.log(`xfer fs${n} b${(n-1)}`);
	}
	console.log(`rack 0`);
}
//Finish last course of tube (and get carrier to the left):
for (let n = min - 1; n >= min - cordWidth - 1; n -= 1) {
	console.log(`knit - b${n} ${carrier}`);
}

//Closed bind-off on the tube:
for (let n = min - cordWidth - 1; n <= min - 1; n += 1) {
	console.log(`xfer b${n} f${n}`);
	console.log(`knit + f${n} ${carrier}`);
	console.log(`rack -1`);
	console.log(`xfer f${n} b${(n+1)}`);
	console.log(`knit + b${(n+1)} ${carrier}`);
	console.log(`rack 0`);
}
console.log(`xfer b${min} f${min}`);

//Knit regular course to get carrier to the right:
for (let n = min; n <= max; n += 1) {
	console.log(`knit + f${n} ${carrier}`);
}

//...now can knit on [min,max].

//Set stitch table entry for (body) knitting:
console.log(`x-stitch-number 106`);

//knit body of the sheet:

for (let r = 0; r < rows; ++r) {
	if (r % 2 == 0) { //even row
		for (let n = max; n >= min; --n) {
			console.log(`knit - f${n} ${carrier}`);
		}
	} else { //odd row:
		for (let n = min; n <= max; ++n) {
			console.log(`knit + f${n} ${carrier}`);
		}
	}
}


//TODO: bind-off of some sort!

//get the yarn out:
console.log(`outhook ${carrier}`);

//just drop everything:
for (let n = max; n >= min; --n) {
	console.log(`drop f${n}`);
}
