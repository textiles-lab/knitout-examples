#!/usr/bin/env node

if (process.argv.length < 4) {
	process.stderr.write("Usage:\n\tnode image-intarsia.js <image.png> <rrggbb:C1> [rrggbb:C2] [...]\nMake an intarsia knit of image.png where all stitches with color #rrggbb are made by carrier C (can/should provide more than one C; first mentioned C will be used for the cast-on.\n");
	process.exit(1);
}

const Colors = {};
const Carriers = [];
const Pattern = [];

//parse the command line:
for (let argi = 3; argi < process.argv.length; ++argi) {
	const m = process.argv[argi].match(/^([0-9A-Fa-f]{6}):(.+)$/);
	if (m === null) {
		console.error(`Failed to parse '${process.argv[argi]}' as 6-digit RRGGBB hex color followed by a colon and a carrier name (like 'ff8051:2').`)
		process.exit(1);
	}
	const color = m[1].toLowerCase();
	const carrier = m[2];
	process.stderr.write(`Will knit ${color} with ${carrier}.\n`);
	if (color in Colors) {
		process.stderr.write(`Error: ${color} is mentioned in mapping more than once.\n`);
		process.exit(1);
	}
	Colors[color] = carrier;

	if (Carriers.indexOf(carrier) === -1) {
		Carriers.push(carrier);
	}
}

process.stderr.write(`Cast-on will be carrier ${Carriers[0]}.\n`);

//read in the image
{
	const fs = require('fs');
	const PNG = require('pngjs').PNG;
	const png = PNG.sync.read(fs.readFileSync(process.argv[2]));
	const Width = png.width;
	const missing = {};
	for (let r = 0; r < png.height; ++r) {
		const Row = [];
		Pattern.push(Row);
		for (let c = 0; c < Width; ++c) {
			const col = {
				r:png.data[4*(png.width*(png.height-1-r)+c)+0],
				g:png.data[4*(png.width*(png.height-1-r)+c)+1],
				b:png.data[4*(png.width*(png.height-1-r)+c)+2]
			};
			const hex = png.data[4*(png.width*(png.height-1-r)+c)+0].toString(16).padStart(2,'0')
			          + png.data[4*(png.width*(png.height-1-r)+c)+1].toString(16).padStart(2,'0')
			          + png.data[4*(png.width*(png.height-1-r)+c)+2].toString(16).padStart(2,'0');

			if (hex in Colors) {
				//great
				Row.push(Colors[hex]);
			} else {
				//oh no
				Row.push(undefined);
				missing[hex] = true;
			}
		}
	}
	if (Object.keys(missing).length > 0) {
		process.stderr.write("Missing colors:\n");
		for (const col of Object.keys(missing).sort()) {
			process.stderr.write(`  #${col}\n`);
		}
		process.exit(1);
	}
	
}

//print out the pattern (for debug purposes):
process.stderr.write(`Pattern (${Pattern[0].length} columns x ${Pattern.length} rows):\n`);
for (let r = 0; r < Pattern.length; ++r) {
	process.stderr.write(Pattern[Pattern.length - 1 - r].join('') + "\n");
}

//intarsia on a sheet, driven by a pattern giving the carrier name per stitch:


console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

for (const cn of Carriers) {
	for (const key in Colors) {
		if (Colors[key] === cn) {
			console.log(`x-vis-color #${key} ${cn}`);
			break;
		}
	}
}

console.log('x-stitch-number 102');

const Width = Pattern[0].length;

let carrierAt = [];
for (let i = 0; i < Carriers.length; ++i) {
	carrierAt.push(NaN);
}

//used to drop the tuck-pattern after carrier brought in:
let toDrop = [];

function bringCarrier(index, n, dir) {
	if (!(carrierAt[index] === carrierAt[index])) {
		//if carrierAt is NaN, carrier needs to be brought in:
		if (dir === '-') {
			console.log('inhook ' + Carriers[index]);
			console.log('tuck - f' + (Width+6) + ' ' + Carriers[index]);
			console.log('tuck - f' + (Width+4) + ' ' + Carriers[index]);
			console.log('tuck - f' + (Width+2) + ' ' + Carriers[index]);
			console.log('tuck + f' + (Width+1) + ' ' + Carriers[index]);
			console.log('tuck + f' + (Width+3) + ' ' + Carriers[index]);
			console.log('tuck + f' + (Width+5) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+6) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+5) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+4) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+3) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+2) + ' ' + Carriers[index]);
			console.log('knit - f' + (Width+1) + ' ' + Carriers[index]);
			toDrop.push('f' + (Width+1));
			toDrop.push('f' + (Width+2));
			toDrop.push('f' + (Width+3));
			toDrop.push('f' + (Width+4));
			toDrop.push('f' + (Width+5));
			toDrop.push('f' + (Width+6));
			console.log('releasehook ' + Carriers[index]);
			carrierAt[index] = Width+1;
		} else {
			console.log('inhook ' + Carriers[index]);
			console.log('tuck + f' + (-7) + ' ' + Carriers[index]);
			console.log('tuck + f' + (-5) + ' ' + Carriers[index]);
			console.log('tuck + f' + (-3) + ' ' + Carriers[index]);
			console.log('tuck - f' + (-2) + ' ' + Carriers[index]);
			console.log('tuck - f' + (-4) + ' ' + Carriers[index]);
			console.log('tuck - f' + (-6) + ' ' + Carriers[index]);
			console.log('knit + f' + (-7) + ' ' + Carriers[index]);
			console.log('knit + f' + (-6) + ' ' + Carriers[index]);
			console.log('knit + f' + (-5) + ' ' + Carriers[index]);
			console.log('knit + f' + (-4) + ' ' + Carriers[index]);
			console.log('knit + f' + (-3) + ' ' + Carriers[index]);
			console.log('knit + f' + (-2) + ' ' + Carriers[index]);
			toDrop.push('f' + (-7));
			toDrop.push('f' + (-6));
			toDrop.push('f' + (-5));
			toDrop.push('f' + (-4));
			toDrop.push('f' + (-3));
			toDrop.push('f' + (-2));
			console.log('releasehook ' + Carriers[index]);
			carrierAt[index] = -2;
		}
	}
	const MaxDis = 6; //maximum distance between tucks that we'll allow
	const TuckAlignment = index; //use different tuck offset among skipped needles
	if (carrierAt[index] > n + MaxDis) {
		let minTuck = n + 1;
		while ((minTuck - TuckAlignment) % MaxDis != 0) ++minTuck;
		let maxTuck = carrierAt[index] - 1;
		while ((maxTuck - TuckAlignment) % MaxDis != 0) --maxTuck;
		for (let i = maxTuck; i >= minTuck; i -= MaxDis) {
			carrierAt[index] = i;
			if (i < Width) { //save a tuck in the gutter
				console.log('tuck - f' + carrierAt[index] + ' ' + Carriers[index]);
			}
		}
	}
	if (carrierAt[index] < n - MaxDis) {
		let minTuck = carrierAt[index] + 1;
		while ((minTuck - TuckAlignment) % MaxDis != 0) ++minTuck;
		let maxTuck = n - 1;
		while ((maxTuck - TuckAlignment) % MaxDis != 0) --maxTuck;
		for (let i = minTuck; i <= maxTuck; i += MaxDis) {
			carrierAt[index] = i;
			if (i >= 0) {
				console.log('tuck + f' + carrierAt[index] + ' ' + Carriers[index]);
			}
		}
	}
}

function doDrops() {
	toDrop.forEach(function(bn){
		console.log('drop ' + bn);
	});
	toDrop = [];
}

//Basic alternating tucks cast-on:
bringCarrier(0,Width-1,'-');
for (let n = Width-1; n >= 0; --n) {
	if ((Width-1 - n) % 2 === 0) {
		console.log('knit - f' + n + ' ' + Carriers[0]);
	}
}
for (let n = 0; n <= Width-1; ++n) {
	if ((Width-1 - n) % 2 !== 0) {
		console.log('knit + f' + n + ' ' + Carriers[0]);
	}
}
doDrops();

//'dir' will track the direction of the next pass:
let dir = '-';

//a few starting rows with Carriers[0]:
for (let r = 0; r < 8; ++r) {
	if (dir === '+') {
		for (let n = 0; n < Width; ++n) {
			console.log('knit + ' + 'f' + n + ' ' + Carriers[0]);
		}
		carrierAt[0] = Width - 1;
		dir = '-';
	} else { //dir === '-'
		for (let n = Width-1; n >= 0; --n) {
			console.log('knit - ' + 'f' + n + ' ' + Carriers[0]);
		}
		carrierAt[0] = 0;
		dir = '+';
	}
}

//Actual intarsia pattern:
for (let rowIndex = 0; rowIndex < Pattern.length; ++rowIndex) {
	const row = Pattern[rowIndex];

	const segments = [];
	for (let begin = 0; begin < row.length; /* later */) {
		let end = begin;
		while (end < row.length && row[end] === row[begin]) ++end;
		segments.push([begin, end]);
		begin = end;
	}

	let done = {};
	if (dir === '+') {
		for (let seed = segments.length - 1; seed >= 0; --seed) {
			const ci = Carriers.indexOf(row[segments[seed][0]]);
			if (done[ci]) continue;
			done[ci] = true;

			//do all segments that features this carrier, in carrier direction:
			for (let index = 0; index < segments.length; ++index) {
				if (ci !== Carriers.indexOf(row[segments[index][0]])) continue;
				const [begin, end] = segments[index];

				bringCarrier(ci, begin, '+');
				for (let n = begin; n < end; ++n) {
					console.log('knit + ' + 'f' + n + ' ' + Carriers[ci]);
				}
				carrierAt[ci] = end - 1;
				if (end < Width) {
					console.log('tuck + ' + 'f' + end + ' ' + Carriers[ci]);
					carrierAt[ci] = end;
				}
			}
			doDrops();
		}
		dir = '-';
	} else { //dir === '-'

		for (let seed = 0; seed < segments.length; ++seed) {
			const ci = Carriers.indexOf(row[segments[seed][0]]);
			if (done[ci]) continue;
			done[ci] = true;

			//do all segments that features this carrier, in carrier direction:
			for (let index = segments.length-1; index >= 0; --index) {
				if (ci !== Carriers.indexOf(row[segments[index][0]])) continue;
				const [begin, end] = segments[index];

				bringCarrier(ci, end - 1, '-');
				for (let n = end - 1; n >= begin; --n) {
					console.log('knit - ' + 'f' + n + ' ' + Carriers[ci]);
				}
				carrierAt[ci] = begin;
				if (begin > 0) {
					console.log('tuck - ' + 'f' + (begin-1) + ' ' + Carriers[ci]);
					carrierAt[ci] = begin-1;
				}
			}
			doDrops();
		}


		/*
			//for now, just make a big stripe
			for (let ci = 0; ci < Carriers.length; ++ci) {
				if (!(carrierAt[ci] === carrierAt[ci])) continue;
				done[ci] = true;
				for (let n = row.length - 1; n >= 0; --n) {
					console.log(`knit - f${n} ${Carriers[ci]}`);
				}
				carrierAt[ci] = -1;
			}
		*/
	/*
		for (let index = 0; index < segments.length; ++index) {
			const [begin, end] = segments[index];
			const ci = Carriers.indexOf(row[begin]);
			bringCarrier(index, end - 1);
			for (let n = end - 1; n >= begin; --n) {
				console.log('knit - ' + 'f' + n + ' ' + Carriers[ci]);
			}
			carrierAt[ci] = begin;
			if (begin > 0) {
				console.log('tuck + ' + 'f' + (begin-1) + ' ' + Carriers[ci]);
				carrierAt[ci] = begin-1;
			}
			doDrops();
		}
	*/
		dir = '+';
	}

	//take out any carriers which were not used in this row:
	//NOTE: could do some lookahead to trail if carrier used in, say, the next row
	for (let ci = 0; ci < Carriers.length; ++ci) {
		if (carrierAt[ci] !== carrierAt[ci]) continue;
		if (done[ci]) continue;
		console.log(`outhook ${Carriers[ci]}`);
		carrierAt[ci] = NaN;
	}
}

//finish up: (assumes that Carriers[0] is in)
for (let index = 1; index < Carriers.length; ++index) {
	if (carrierAt[index] === carrierAt[index]) {
		console.log('outhook ' + Carriers[index]);
		carrierAt[index] = NaN;
	}
}

//a few final rows with Carriers[0]:
if (dir === '+') bringCarrier(0,0,'+');
if (dir === '-') bringCarrier(0,Width-1,'-');

for (let r = 0; r < 8; ++r) {
	if (dir === '+') {
		for (let n = 0; n < Width; ++n) {
			console.log('knit + ' + 'f' + n + ' ' + Carriers[0]);
		}
		dir = '-';
	} else { //dir === '-'
		for (let n = Width-1; n >= 0; --n) {
			console.log('knit - ' + 'f' + n + ' ' + Carriers[0]);
		}
		dir = '+';
	}
	doDrops();
}

console.log('outhook ' + Carriers[0]);

//drop:
for (let n = 0; n < Width; ++n) {
	console.log('drop ' + 'f' + n);
}
