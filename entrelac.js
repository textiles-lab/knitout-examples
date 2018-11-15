#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"


let height = 19; //height of square
let width = Math.floor(height/2); //width of each square
let reps = 2; //how many squares in each row
let repeats = 1; //each repeat is a pair of square rows
let padding = 15;
let Carrier = 5;
let Carrier2 = 3;
let min = 1;
let max = min + (2*reps+1)*(width);

let xfer_inside = true; //if true, slant rows inside the squares

console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

console.log("inhook " + Carrier);

console.log("x-stitch-number " + 67);

for (let n = max; n >= min; --n) {
	if ((max-n) % 2 == 0) {
		console.log("tuck - f" + n + " " + Carrier);
	}
}
for (let n = min; n <= max; ++n) {
	if ((max-n)%2 == 1) {
		console.log("tuck + f" + n + " " + Carrier);
	} else if (n === max) {
		console.log("miss + f" + n + " " + Carrier);
	}
}

console.log("x-stitch-number " + 95); //might be better than 68?
for (let n = max; n >= min; --n) {
	console.log("knit - f" + n + " " + Carrier);
}
console.log("releasehook " + Carrier);
for (let row = 0; row < padding; row += 2) {
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier);
	}
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Carrier);
	}
}

if (Carrier2) {
	console.log("inhook " + Carrier2);
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier2);
	}
	console.log("releasehook " + Carrier2);
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Carrier2);
	}
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier2);
	}
}

//knit a right-leaning square:
// ----------->
//      x x o <-- this tip is not knit because the next square is expected to overlap
//    x x x
//  x x x
//  ^   ^   ^
//  min mid max
function rightSquare(min) {
	for (let row = 0; row < height; ++row) {
		let step = Math.floor(row/2);
		let left = min+step;
		let right = min+step+width-1;
		if (row + 1 === width) right -= 1;
		if (row % 2 === 0) {
			if (xfer_inside && row > 0) {
				console.log("rack -1");
				for (let n = left-1; n <= right-1; ++n) {
					console.log("xfer f" + n + " b" + (n+1));
				}
				console.log("rack 0");
				for (let n = left-1; n <= right; ++n) {
					console.log("xfer b" + n + " f" + n);
				}
			}
			for (let n = left; n <= right; ++n) {
				console.log("knit + f" + n + " " + Carrier);
			}
		} else {
			for (let n = right; n >= left; --n) {
				if (xfer_inside && n == left) {
					console.log("split - f" + n + " b" + n + " " + Carrier);
				} else {
					console.log("knit - f" + n + " " + Carrier);
				}
			}
		}
	}
}

// ------->
//  x x o <-- this tip is not knit because the next square is expected to overlap
//  x x
//  x
//  ^   ^
//  min max
function rightTriangle(min) {
	for (let row = 0; row < height; ++row) {
		let step = Math.floor(row/2);
		let left = min;
		let right = min+step;
		if (row + 1 === height) right -= 1;
		if (row % 2 === 0) {
			for (let n = left; n <= right; ++n) {
				console.log("knit + f" + n + " " + Carrier);
			}
		} else {
			for (let n = right; n >= left; --n) {
				console.log("knit - f" + n + " " + Carrier);
			}
		}
	}
}

//knit a left-leaning square:
// <---------
//  o x x     <-- this tip is not knit because the next square is expected to overlap
//    x x x
//      x x x
//  ^   ^   ^
//  min mid max
function leftSquare(max) {
	let C = (Carrier2 ? Carrier2 : Carrier);
	for (let row = 0; row < height; ++row) {
		let step = Math.floor(row/2);
		let left = max-step-(width-1);
		let right = max-step;
		if (row + 1 === width) left += 1;
		if (row % 2 === 0) {
			if (xfer_inside && row > 0) {
				console.log("rack 1");
				for (let n = right+1; n >= left+1; --n) {
					console.log("xfer f" + n + " b" + (n-1));
				}
				console.log("rack 0");
				for (let n = right+1; n >= left; --n) {
					console.log("xfer b" + n + " f" + n);
				}
			}

			for (let n = right; n >= left; --n) {
				console.log("knit - f" + n + " " + C);
			}
		} else {
			for (let n = left; n <= right; ++n) {
				if (xfer_inside && n == right) {
					console.log("split - f" + n + " b" + n + " " + C);
				} else {
					console.log("knit + f" + n + " " + C);
				}
			}
		}
	}
}

// <---------
//  o x x     <-- this tip is not knit because the next square is expected to overlap
//    x x
//      x
//  ^   ^
//  mid max
function leftTriangle(max) {
	let C = (Carrier2 ? Carrier2 : Carrier);
	for (let row = 0; row < height; ++row) {
		let step = Math.floor(row/2);
		let left = max-step;
		let right = max;
		if (row + 1 === height) left += 1;
		if (row % 2 === 0) {
			for (let n = right; n >= left; --n) {
				console.log("knit - f" + n + " " + C);
			}
		} else {
			for (let n = left; n <= right; ++n) {
				console.log("knit + f" + n + " " + C);
			}
		}
	}
}

for (let cr = 0; cr < repeats; ++cr) {
	rightTriangle(min);
	for (let rep = 0; rep < reps; ++rep) {
		rightSquare(min + (2*rep+1)*width);
	}
	console.log("knit + f" + max + " " + Carrier);
	if (Carrier2) {
		for (let n = max; n >= min; --n) {
			console.log("knit - f" + n + " " + Carrier);
		}
	}

	leftTriangle(min + (2*reps+1)*width);
	for (let rep = reps-1; rep >= 0; --rep) {
		leftSquare(min + (2*rep+2)*width);
	}
	if (Carrier2) {
		console.log("knit - f" + min + " " + Carrier2);

		for (let n = min; n <= max; ++n) {
			console.log("knit + f" + n + " " + Carrier2);
		}
	} else {
		console.log("knit - f" + min + " " + Carrier);
	}
}

if (Carrier2) {
	console.log("outhook " + Carrier2);
}


for (let row = 0; row < padding; row += 2) {
	for (let n = min; n <= max; ++n) {
		console.log("knit + f" + n + " " + Carrier);
	}
	for (let n = max; n >= min; --n) {
		console.log("knit - f" + n + " " + Carrier);
	}
}
for (let n = min; n <= max; ++n) {
	console.log("knit + f" + n + " " + Carrier);
}


console.log("outhook " + Carrier);
