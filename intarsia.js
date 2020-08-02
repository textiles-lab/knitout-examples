#!/usr/bin/env node

//intarsia on a sheet, driven by a pattern giving the carrier name per stitch:

const Carriers = ["4", "5", "6"];

const Pattern = [
	".......XXX.............",
	"......XXXX.............",
	"......XXXX.............",
	".............XXX.......",
	"...............XX......",
	"................XX.....",
	"................XX.....",
	"................XX.....",
	"...............XX......",
	".............XXX.......",
	"......XXXX.............",
	"......XXXX.............",
	".......XXX.............",
];

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");


const Width = Pattern[0].length;

let carrierAt = [];
for (let i = 0; i < Carriers.length; ++i) {
	carrierAt.push(NaN);
}

//used to drop the tuck-pattern after carrier brought in:
let toDrop = [];

function bringCarrier(index, n) {
	if (!(carrierAt[index] === carrierAt[index])) {
		//if carrierAt is NaN, carrier needs to be brought in:
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
	}
	const MaxDis = 4; //maximum distance between tucks that we'll allow
	const TuckAlignment = index; //use different tuck offset among skipped needles
	if (carrierAt[index] > n + MaxDis) {
		let minTuck = n + 1;
		while ((minTuck - TuckAlignment) % MaxDis != 0) ++minTuck;
		let maxTuck = carrierAt[index] - 1;
		while ((maxTuck - TuckAlignment) % MaxDis != 0) --maxTuck;
		for (let i = maxTuck; i >= minTuck; i -= MaxDis) {
			carrierAt[index] = i;
			console.log('tuck - f' + carrierAt[index] + ' ' + Carriers[index]);
		}
	}
	if (carrierAt[index] < n - MaxDis) {
		let minTuck = carrierAt[index] + 1;
		while ((minTuck - TuckAlignment) % MaxDis != 0) ++minTuck;
		let maxTuck = n - 1;
		while ((maxTuck - TuckAlignment) % MaxDis != 0) --maxTuck;
		for (let i = minTuck; i <= maxTuck; i += MaxDis) {
			carrierAt[index] = i;
			console.log('tuck + f' + carrierAt[index] + ' ' + Carriers[index]);
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
bringCarrier(0,Width-1);
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
for (let r = 0; r < 4; ++r) {
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
for (let rowIndex = Pattern.length - 1; rowIndex >= 0; --rowIndex) {
	const row = Pattern[rowIndex];
	const segments = [];
	for (let begin = 0; begin < row.length; /* later */) {
		let end = begin;
		while (end < row.length && row[end] === row[begin]) ++end;
		segments.push([begin, end]);
		begin = end;
	}
	console.assert(segments.length <= Carriers.length);

	if (dir === '+') {
		for (let index = segments.length - 1; index >= 0; --index) {
			const [begin, end] = segments[index];
			bringCarrier(index, begin);
			for (let n = begin; n < end; ++n) {
				console.log('knit + ' + 'f' + n + ' ' + Carriers[index]);
			}
			carrierAt[index] = end - 1;
			if (end < Width) {
				console.log('tuck + ' + 'f' + end + ' ' + Carriers[index]);
				carrierAt[index] = end;
			}
			doDrops();
		}
		dir = '-';
	} else { //dir === '-'
		for (let index = 0; index < segments.length; ++index) {
			const [begin, end] = segments[index];
			bringCarrier(index, end - 1);
			for (let n = end - 1; n >= begin; --n) {
				console.log('knit - ' + 'f' + n + ' ' + Carriers[index]);
			}
			carrierAt[index] = begin;
			if (begin > 0) {
				console.log('tuck - ' + 'f' + (begin-1) + ' ' + Carriers[index]);
				carrierAt[index] = begin-1;
			}
			doDrops();
		}
		dir = '+';
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
for (let r = 0; r < 4; ++r) {
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
}

console.log('outhook ' + Carriers[0]);

//drop:
for (let n = 0; n < Width; ++n) {
	console.log('drop ' + 'f' + n);
}
