// import the knitoutWriter code and instantiate it as an object
var knitout = require('../../knitout-frontend-js/knitout');
k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');

// swatch variables
var height = 40;
var width = 41; //want to put first stich on the front bed, hack for now
var carrier = '6';

// bring in carrier using yarn inserting hook
k.inhook(carrier);

var front = width%2;


// tuck on alternate needles to cast on
for (var s=width; s>0; s--) {
	if (s%2 == front) {
		k.tuck("-", "f"+s, carrier);
	}
	else {
		//k.miss("-", "f"+s, carrier);
	}
}
for (var s=1; s<=width; s++) {
	if (s%2 != front) {
		k.tuck("+", "f"+s, carrier);
	}
	else {
		//k.miss("+", "f"+s, carrier);
	}
}

// release the yarn inserting hook
k.releasehook(carrier);


// knit some rows back and forth
for (var h=0; h<height; h++) {
	for (var s=width; s>0; s--) {
        k.knit("-", "f"+s, carrier);
	}
    for (var s=width; s>0; s--) {
        k.xfer("f"+s, "b"+s);
	}
	for (var s=1; s<=width; s++) {
		k.knit("+", "b"+s, carrier);
	}
    for (var s=1; s<=width; s++) {
		k.xfer("b"+s, "f"+s);
	}
}

// bring the yarn out with the yarn inserting hook
k.outhook(carrier);

// write the knitout to a file called "out.k"
k.write('../../swatches/garter.k');


