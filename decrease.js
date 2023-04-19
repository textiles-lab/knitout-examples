//headers:
console.log(';!knitout-2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');


//global parameters:
const Width = 21;
const Carrier = 3;
//where to stack up stitches:
//just in the middle:
//const DecreaseLeftAt = 11;
//const DecreaseRightAt = 11;
//slightly fancier:
const DecreaseLeftAt = 11-2;
const DecreaseRightAt = 11+2;



//track edges of cloth:
let min = 1;
let max = Width;

//cast-on:
console.log(`inhook ${Carrier}`);
for (let n = max; n >= min; --n) {
	if ((n - max) % 2 === 0) {
		console.log(`tuck - f${n} ${Carrier}`);
	}
}
for (let n = min; n <= max; ++n) {
	if ((n - max) % 2 !== 0) {
		console.log(`tuck + f${n} ${Carrier}`);
	}
}

//"knit a row" function:
let carrierSide = '+';
function knitrow() {
	if (carrierSide === '+') {
		//if carrier is on the right, knit left:
		for (let n = max; n >= min; --n) {
			console.log(`knit - f${n} ${Carrier}`);
		}
		carrierSide = '-';
	} else {
		//if carrier is on the left, knit right:
		for (let n = min; n <= max; ++n) {
			console.log(`knit + f${n} ${Carrier}`);
		}
		carrierSide = '+';
	}
}

//start with some boring rows:
knitrow();
knitrow();
console.log(`releasehook ${Carrier}`);
knitrow();
knitrow();
//now narrow the fabric and knit a row repeatedly:
for (let step = 0; step < 10; ++step) {
	if (carrierSide === '+') {
		//carrier is on the right, so move the left half of the cloth:
		for (let n = min; n < DecreaseLeftAt; ++n) {
			console.log(`xfer f${n} b${n}`);
		}
		console.log(`rack 1`);
		for (let n = min; n < DecreaseLeftAt; ++n) {
			console.log(`xfer b${n} f${n+1}`);
		}
		console.log(`rack 0`);
		min += 1; //update cloth bounds
	} else {
		//carrier is on the left, so move the right half of the cloth:
		for (let n = DecreaseRightAt+1; n <= max; ++n) {
			console.log(`xfer f${n} b${n}`);
		}
		console.log(`rack -1`);
		for (let n = DecreaseRightAt+1; n <= max; ++n) {
			console.log(`xfer b${n} f${n-1}`);
		}
		console.log(`rack 0`);
		max -= 1; //update cloth bounds
	}
	knitrow();
}

//finish with some plain ol' knitting:
knitrow();
knitrow();
knitrow();
knitrow();

//take out the yarn carrier:
console.log(`outhook ${Carrier}`);

//drop the finished fabric:
for (let n = min; n <= max; ++n) {
	console.log(`drop f${n}`);
}


