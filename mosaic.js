#!/usr/bin/env node
//"garter stitch mosaic", in the style of:
// https://blog.weareknitters.com/knitting-stitches/how-to-knit-color-mosaics-in-garter-stitch/

//example mosaic from:
//https://chi2019.acm.org/2019/04/04/chi-2019-cowl-knitting-pattern/ 
const mosaic = [
	".#..#..#####.#..#.",
	".......#...#......",
	".#..#..#.#.#.#..#.",
	".......#..........",
	".#.###########..#.",
	"...#...#.....#....",
	".#.#.#.#.#.#.#.###",
	"...#...#.....#...#",
	".#.###.#.#.#.#.#.#",
	".......#.....#...#",
	".#..#..###########",
	".............#....",
	".#..#..#.#.#.#..#.",
	".........#...#....",
	".#..#..#.#####..#.",
];

//check mosaic:
mosaic.forEach(function(line){
	console.assert(line.length === mosaic[0].length, "mosaic should have lines of the same length");
	console.assert(/^[.#]*$/.test(line), "mosaic lines should have only '.' or '#'");
});

let min = 1;
let max = min + mosaic[0].length - 1;
let CarrierA = 3;
let CarrierB = 6;

console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("inhook " + CarrierA);

//cast on (alternating tucks):
console.log("x-stitch-number " + 68); //looser cast-on
for (let n = max; n >= min; --n) {
	if ((max-n) % 2 == 0) {
		console.log("tuck - f" + n + " " + CarrierA);
	}
}
for (let n = min; n <= max; ++n) {
	if ((max-n) % 2 == 1) {
		console.log("tuck + f" + n + " " + CarrierA);
	}
}

console.log("x-stitch-number " + 63); //standard stitch

//some plain knitting to start:
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + CarrierA);
}
for (let n = min; n <= max; ++n) {
	console.log("knit + f" + n + " " + CarrierA);
}
console.log("releasehook " + CarrierA);
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + CarrierA);
}

//bring in carrier B and do some plain knitting as well:
console.log("inhook " + CarrierB);
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + CarrierB);
}
for (let n = min; n <= max; ++n) {
	console.log("knit + f" + n + " " + CarrierB);
}
console.log("releasehook " + CarrierB);
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + CarrierB);
}

//now knit the mosaic:
for (let m = mosaic.length-1; m >= 0; --m) {
	let row = mosaic[m];
	console.assert(max - min + 1 === row.length, "Mosaic row should be long enough.");

	const Carrier = ((m % 2) == 0 ? CarrierA : CarrierB);
	const Symbol = ((m % 2) == 0 ? '#' : '.');

	//back-bed knit everything marked with the current symbol:

	//(a) xfer to back:
	for (let n = min; n <= max; ++n) {
		if (row[n-min] === Symbol) {
			console.log("xfer f" + n + " " + "b" + n + " ;xfer '" + Symbol + "'");
		}
	}
	//(b) knit:
	for (let n = min; n <= max; ++n) {
		if (row[n-min] === Symbol) {
			console.log("knit + b" + n + " " + Carrier);
		} else if (n === max) {
			//make sure carrier is out of the way:
			console.log("miss + b" + n + " " + Carrier);
		}
	}

	//now front-bed knit everything marked with the current symbol:

	//(a) xfer to front:
	for (let n = max; n >= min; --n) {
		if (row[n-min] === Symbol) {
			console.log("xfer b" + n + " " + "f" + n + " ;return '" + Symbol + "'");
		}
	}
	//(b) knit:
	for (let n = max; n >= min; --n) {
		if (row[n-min] === Symbol) {
			console.log("knit - f" + n + " " + Carrier);
		} else if (n === min) {
			//make sure carrier is out of the way:
			console.log("miss - f" + n + " " + Carrier);
		}
	}
}


