// import the knitoutWriter code and instantiate it as an object
const knitout = require('knitout');
k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');


// swatch variables
let height = 40;
let width = 20;
let carrier = '6';

// make sure the very first stitch in on the front bed,
// since the machine complains if its on the back
const front = width%2;

// bring in carrier using yarn inserting hook
k.inhook(carrier);

//perform the initial tuck cast on
for (let s=width; s>0; s--) {
	if(s%2==front) {
		k.tuck("-", "f"+s, carrier);
	}
	else {
		k.tuck("-", "b"+s, carrier);
	}
}

//knit the tucked on stitches, making sure to skip the one we just tucked
for (let s=2; s<=width; s++) {
	if (s%2==front) {
		k.knit("+", "f"+s, carrier);
	}
	else {
		k.knit("+", "b"+s, carrier);
	}
}

// release the yarn inserting hook
k.releasehook(carrier);

//knit until our swatch is the right length
let current_height = 0;

while (current_height < height) {
	for (let s=width; s>0; s--) {
		if (s%2==front) {
			k.knit("-", "f"+s, carrier);
		}
		else {
			k.knit("-", "b"+s, carrier);
		}
	}
	current_height++;

	for (let s=1; s<=width; s++) {
		if (s%2==front) {
			k.knit("+", "f"+s, carrier);
		}
		else {
			k.knit("+", "b"+s, carrier);
		}
	}
	current_height++;
}

// bring the yarn out with the yarn inserting hook
k.outhook(carrier);

// write the knitout to a file called "flatrib.k" 
k.write('rib1x1.k');
