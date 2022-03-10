//title: Sheet I-Cord Bind-Off (plain javascript)
// Binds off a sheet by knitting a small tube, picking up one stitch from the bed each row.

//Write header:
console.log(';!knitout-2');
console.log(';;Machine: SWGN2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');

//Parameters:
const min = 1; //needle number of left edge
const max = 20; //needle number of right edge
const carrier = "2"; //carrier name
const cordWidth = 4; //cord width
const rows = 20;

//Bring in carrier:
console.log(`inhook ${carrier}`);
//Set stitch table entry for cast-on:
console.log(`x-stitch-number 101`);

//alternating tucks cast-on:
for (let n = max; n >= min; --n) {
	if ((max - n) % 2 == 0) console.log(`tuck - f${n} ${carrier}`);
}
for (let n = min; n <= max; ++n) {
	if ((max - n) % 2 != 0) console.log(`tuck + f${n} ${carrier}`);
}

//knit over to the right to finish the cast-on:
for (let n = max; n >= min; n -= 1) {
	console.log(`knit - f${n} ${carrier}`);
}

for (let n = min; n <= max; n += 1) {
	console.log(`knit + f${n} ${carrier}`);
}

//send out yarn inserting hook; it is no longer needed to hold the yarn in place:
console.log(`releasehook ${carrier}`);

//...now can knit on [min,max].

//Set stitch table entry for (body) knitting:
console.log(`x-stitch-number 106`);

//knit body of the sheet:

for (let r = 0; r < rows; ++r) {
	if (r % 2 == 0) { //even row
		for (let n = max; n >= min; n -= 1) {
			console.log(`knit - f${n} ${carrier}`);
		}
	} else { //odd row:
		for (let n = min; n <= max; n += 1) {
			console.log(`knit + f${n} ${carrier}`);
		}
	}
}


console.assert(rows % 2 == 0, "Expecting an even number of rows -- tube is hard-coded to start on the right!");

//All-needle closed-tube cast-on, with carrier ending on the right:
console.log(`x-stitch-number 101`);

console.log(`rack 0.25`);
for (let n = max + 1; n <= max + cordWidth; n += 1) {
	console.log(`tuck + f${n} ${carrier}`);
	console.log(`tuck + b${n} ${carrier}`);
}
console.log(`rack 0`);

//Set stitch table entry for tube knitting:
console.log(`x-stitch-number 105`);

//Knit a small tube, moving to the left each course in order to absorb any stitches remaining on the bed:
//Start the front of the first course of the tube:
for (let n = max + cordWidth; n >= max + 1; n -= 1) {
	console.log(`knit - f${n} ${carrier}`);
}
//Middle of tube:
for (let tubeMin = max + 1; tubeMin > min; tubeMin -= 1) {
	let tubeMax = tubeMin + cordWidth-1;
	//back of the tube:
	for (let n = tubeMin; n <= tubeMax; n += 1) {
		console.log(`knit + b${n} ${carrier}`);
	}
	//move front of the tube left (potentially stacking onto an existing stitch):
	for (let n = tubeMin; n <= tubeMax; n += 1) {
		console.log(`xfer f${n} bs${n}`);
	}
	console.log(`rack -1`);
	for (let n = tubeMin; n <= tubeMax; n += 1) {
		console.log(`xfer bs${n} f${(n-1)}`);
	}
	console.log(`rack 0`);

	//knit front of tube:
	for (let n = tubeMax; n >= tubeMin; n -= 1) {
		console.log(`knit - f${(n-1)} ${carrier}`);
	}

	//scoot back of tube left (potentially stacking onto an existing stitch):
	for (let n = tubeMin; n <= tubeMax; n += 1) {
		console.log(`xfer b${n} fs${n}`);
	}
	console.log(`rack 1`);
	for (let n = tubeMin; n <= tubeMax; n += 1) {
		console.log(`xfer fs${n} b${(n-1)}`);
	}
	console.log(`rack 0`);
}
//Finish last course of tube:
for (let n = min; n <= min + cordWidth - 1; n += 1) {
	console.log(`knit + b${n} ${carrier}`);
}

//Closed bind-off on the tube:
for (let n = min + cordWidth-1; n >= min; n -= 1) {
	console.log(`xfer b${n} f${n}`);
	console.log(`knit - f${n} ${carrier}`);
	if (n == min) break;
	console.log(`rack +1`);
	console.log(`xfer f${n} b${(n-1)}`);
	console.log(`knit + b${(n-1)} ${carrier}`);
	console.log(`rack 0`);
}

//knit a tag:
console.log(`knit + f${min} ${carrier}`);
console.log(`knit - f${min+1} ${carrier}`);
console.log(`knit - f${min} ${carrier}`);
console.log(`knit + f${min} ${carrier}`);
console.log(`knit + f${min+1} ${carrier}`);
console.log(`knit - f${min+2} ${carrier}`);
console.log(`knit - f${min+1} ${carrier}`);
console.log(`knit - f${min} ${carrier}`);
console.log(`knit + f${min} ${carrier}`);
console.log(`knit + f${min+1} ${carrier}`);
console.log(`knit + f${min+2} ${carrier}`);
console.log(`knit - f${min+2} ${carrier}`);
console.log(`knit - f${min+1} ${carrier}`);
console.log(`knit - f${min} ${carrier}`);
console.log(`knit + f${min} ${carrier}`);
console.log(`knit + f${min+1} ${carrier}`);
console.log(`knit + f${min+2} ${carrier}`);

//get the yarn out:
console.log(`outhook ${carrier}`);

//just drop everything:
for (let n = max; n >= min; --n) {
	console.log(`drop f${n}`);
}
