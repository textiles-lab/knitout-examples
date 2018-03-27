// import the knitoutWriter code and instantiate it as an object
// passing in all eight carriers despite not using all of them
const knitout = require('../../knitout-frontend-js/knitout');
let k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');

// swatch variables
var height = 30;
var width = 41;
var carrier = '6';

// make sure the very first stitch in on the front bed,
// since the machine complains if its on the back
var front = width%2;

// bring in carrier using yarn inserting hook
k.inhook(carrier);


//initial tuck cast-on
for (var s=width; s>0; s--) {
    if(s%2==front) {
        k.tuck("-", "f"+s, carrier);
    }
    else {
        k.tuck("-", "b"+s, carrier);
    }
}

//rib on way back, skip last of the tucks
for (var s=2; s<=width; s++) {
    if (s%2==front) {
        k.knit("+", "f"+s, carrier);
    }
    else {
        k.knit("+", "b"+s, carrier);
    }
}

//lets knit an extra row to make sure stitches are definitely stable



// release the yarn inserting hook
k.releasehook(carrier);


// knit until we have the right swatch height
var current_height = 0
while (current_height<height) {
	for (var s=width; s>0; s--) {
		if (s%2==front) {
			k.knit("-", "f"+s, carrier);
		}
		else {
			k.knit("-", "b"+s, carrier);
		}
	}


	for (var s=width; s>0; s--) {
		if (s%2==front) {
			k.xfer("f"+s, "b"+s);
		}
		else {
			k.xfer("b"+s, "f"+s);
		}
	}

	
	current_height++;

	if (current_height >= height) {
		break;
	}

	for (var s=1; s<=width; s++) {
		if (s%2==front) {
			k.knit("+", "b"+s, carrier);
		}
		else {
			k.knit("+", "f"+s, carrier);
		}
	}


	for (var s=1; s<=width; s++) {
		if (s%2==front) {
			k.xfer("b"+s, "f"+s);
		}
		else {
			k.xfer("f"+s, "b"+s);
		}
	}

	
	current_height++;
}

// bring the yarn out with the yarn inserting hook
k.outhook(carrier);

// write the knitout to a file called "out.k"
k.write('../../swatches/seedstitch.k');



