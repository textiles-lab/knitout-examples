// import the knitoutWriter code and instantiate it as an object
var knitoutWriter = require('knitoutWriter');
k = new knitoutWriter({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');
k.addHeader('Carriers', '6');

// swatch variables
var height = 40;
var width = 20;
var carrier = 6;

// make sure the very first stitch in on the front bed,
// since the machine complains if its on the back
var front = width%2;

// bring in carrier using yarn inserting hook
k.inhook(carrier);

//perform the initial tuck cast on
for (var s=width; s>0; s--) {
	if(s%2==front) {
		k.tuck("-", "f"+s, carrier);
	}
	else {
		k.tuck("-", "b"+s, carrier);
	}
}

//knit the tucked on stitches, making sure to skip the one we just tucked
for (var s=2; s<=width; s++) {
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
var current_height = 0;

while (current_height < height) {
	for (var s=width; s>0; s--) {
		if (s%2==front) {
			k.knit("-", "f"+s, carrier);
		}
		else {
			k.knit("-", "b"+s, carrier);
		}
	}
	current_height++;

	for (var s=1; s<=width; s++) {
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

// write the knitout to a file called "flatrib.k" in output folder
k.write('output/rib1x1.k');
