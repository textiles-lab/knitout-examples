//title: Single Jersey Tube (plain javascript)

//Write header:
console.log(';!knitout-2');
console.log(';;Machine: SWGN2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');


//load an image and knit a half gauge tube of it:
if (process.argv.length < 3) {
	console.error("Usage:\n\timage-tube.js <image.png>");
	process.exit(1);
}

const image = process.argv[2];

const fs = require('fs');
const PNG = require('pngjs').PNG;
const png = PNG.sync.read(fs.readFileSync(image));

//Parameters:
const f_min = 1; //needle number of left edge
const f_max = Math.floor(png.width / 2); //needle number of right edge
const b_min = f_min;
const b_max = png.width - f_max;

console.assert((f_max - f_min + 1) + (b_max - b_min + 1) == png.width, "Have exactly the right number of needles.");

let carrier = "2"; //carrier name
const castonStitch = 101; //want: 30 25
const knittingStitch = 102; //want: 40 25

//use the yarn presser ("why not?")
console.log(`x-presser-mode auto`);

// ---- set up initial loops and yarn carrier ----
//Bring in carrier:
console.log(`inhook ${carrier}`);

console.log(`x-stitch-number ${castonStitch}`);

//On SWGN2 machines, carriers start on the right,
//so will start tucking onto needles right-to-left:
for (let n = f_max; n >= f_min; n -= 1) {
	//tuck alternating needles starting at the right edge:
	if ((f_max - n) % 2 === 0) {
		console.log(`tuck - f${2*n} ${carrier}`);
	}
}

//...continue clockwise around the tube to the back bed:
for (let n = b_min; n <= b_max; n += 1) {
	//note that adding 1+max-min preserves the alternating-needles pattern:
	if ((1+f_max-f_min + n - b_min) % 2 === 0) {
		console.log(`tuck + b${2*n-1} ${carrier}`);
	}
}

//...continue clockwise around the tube to the front bed and fill in needles missed the first time:
for (let n = f_max; n >= f_min; n -= 1) {
	if ((f_max - n) % 2 !== 0) {
		console.log(`tuck - f${2*n} ${carrier}`);
	}
}

//...finally, fill in the rest of the back bed:
for (let n = b_min; n <= b_max; n += 1) {
	if ((1+f_max-f_min + n - b_min) % 2 !== 0) {
		console.log(`tuck + b${2*n-1} ${carrier}`);
	}
}

console.log(`x-stitch-number ${knittingStitch}`);

//now knit a row of plain knitting to let the cast-on stitches relax:
for (let n = f_max; n >= f_min; n -= 1) {
	console.log(`knit - f${2*n} ${carrier}`);
}
if (2*f_min > 2*b_min-1) console.log(`miss - f${2*b_min-1} ${carrier}`);
//finish the back of the row of plain knitting:
for (let n = b_min; n <= b_max; n += 1) {
	console.log(`knit + b${2*n-1} ${carrier}`);
}
if (2*b_max-1 < 2*f_max) console.log(`miss + f${2*f_max} ${carrier}`);
//send the yarn inserting hook out -- yarn should be well-enough held by the needles at this point.
console.log(`releasehook ${carrier}`);

function sameBed(row, column) {
	const x = column;
	const y = png.height - 1 - row;
	const c = {
		r:png.data[(y*png.width+x)*4+0],
		g:png.data[(y*png.width+x)*4+1],
		b:png.data[(y*png.width+x)*4+2]
	};

	if        (c.r == 0xff && c.g == 0x00 && c.b == 0x00) { //#ff0000
		return true;
	} else if (c.r == 0x00 && c.g == 0xff && c.b == 0x00) { //#00ff00
		return false;
	} else {
		throw new Error(`Unexpected color: ${JSON.stringify(c)}`);
	}
}

// ----  tube ----
//Create a single-jersey (all knits) tube:
for (let r = 0; r < png.height; r += 1) {

	let f_target = [];
	let b_target = [];

	//map image to targets counterclockwise:
	// 0 1 2 3 4 5 6 7
	// back:  [ 3 2 1 0 ]
	// front: [ 4 5 6 7 ]
	for (let x = 0; x < png.width; x += 1) {
		if (x <= b_max - b_min) {
			b_target.unshift( (sameBed(r, x) ? 'b' : 'f') );
		} else {
			f_target.push( (sameBed(r, x) ? 'f' : 'b') );
		}
	}

	console.assert(f_target.length === f_max - f_min + 1 && b_target.length == b_max - b_min + 1, "Target lists are of proper length.");

	//set up front:
	for (let n = f_max; n >= f_min; n -= 1) {
		if (f_target[n-f_min] === 'b') {
			console.log(`xfer f${2*n} b${2*n}`);
		}
	}

	//knit front of tube going left:
	for (let n = f_max; n >= f_min; n -= 1) {
		console.log(`knit - ${f_target[n-f_min]}${2*n} ${carrier}`);
	}
	if (2*f_min > 2*b_min-1) console.log(`miss - f${2*b_min-1} ${carrier}`);

	//stash front:
	for (let n = f_max; n >= f_min; n -= 1) {
		if (f_target[n-f_min] === 'b') {
			console.log(`xfer b${2*n} f${2*n}`);
		}
	}

	//set up back:
	for (let n = b_min; n <= b_max; n += 1) {
		if (b_target[n-b_min] === 'f') {
			console.log(`xfer b${2*n-1} f${2*n-1}`);
		}
	}

	//knit back of tube going right:
	for (let n = b_min; n <= b_max; n += 1) {
		console.log(`knit + ${b_target[n-b_min]}${2*n-1} ${carrier}`);
	}
	if (2*b_max-1 < 2*f_max) console.log(`miss + f${2*f_max} ${carrier}`);

	//stash back:
	for (let n = b_min; n <= b_max; n += 1) {
		if (b_target[n-b_min] === 'f') {
			console.log(`xfer f${2*n-1} b${2*n-1}`);
		}
	}
}

// ---- take carrier out and drop remaining loops ----
//Take carrier out with yarn inserting hook:
console.log(`outhook ${carrier}`);

//drop loops:
for (let n = f_min; n <= f_max; n += 1) {
	console.log(`drop f${2*n}`);
}
for (let n = b_min; n <= b_max; n += 1) {
	console.log(`drop b${2*n-1}`);
}
