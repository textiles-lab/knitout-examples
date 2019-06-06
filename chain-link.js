#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";

/*
 interlaced sheets:

   \/  \/ _____,- 'stacked'
   /\  /\
  |  \/  | _____,- 'skewed'
  |  /\  |
   \/  \/
   /\  /\

(left sheet always is atop right sheet.)
 */

//number of sheets == number of carriers:
//const Carriers = ['3','4','5','6']; //,'7','8'];
//const Width = 16;
const Carriers = ['1','2','3','4','5','6','7','8','9','10'];
const Width = 16;
const Diamonds = 2;

//"skew" runs from 0 (fully stacked) to Width/2 (fully skewed)
function makeMinMax(skew, ci) {
	//fully stacked min/max:
	let min = 2*Width*Math.floor(ci/2) + (ci%2);
	let max = min + 2 * (Width-1);

	if ((ci%2) === 0) {
		//even sheets skew left
		min -= 2*skew;
		max -= 2*skew;
	} else {
		//odd sheets skew right
		min += 2*skew;
		max += 2*skew;
	}
	return {min:min, max:max};
}

function makeHome(skew, ci) {
	let home = new Array(Width);
	//compute home for each stitch:
	for (let s = 0; s < Width; ++s) {
		if (ci % 2 === 0) {
			home[s] = (s < 2*skew ? 'b' : 'f');
		} else {
			home[s] = (Width-1-s < 2*skew ? 'f' : 'b');
		}
	}
	return home;

}

function makeTarget(skew, ci) {
	let target = new Array(Width);
	//compute target for each stitch:
	// 1x1 rib:
	for (let s = 0; s < Width; ++s) {
		target[s] = (s % 2 == 0 ? 'f' : 'b');
	}
	/*
	//"lazy debug target":
	let home = makeHome(skew, ci);
	for (let s = 0; s < Width; ++s) {
		target[s] = home[s];
	}*/
	return target;
}

console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")


function castOn(carrier,min,max) {
	console.log("x-stitch-number 66");
	console.log("inhook " + carrier);
	for (let n = max; n >= min; n -= 2) {
		if ((max-n)%4 === 0) {
			console.log("tuck - f" + n + " " + carrier);
		}
	}
	for (let n = min; n <= max; n += 2) {
		if ((max-n)%4 !== 0) {
			console.log("tuck + f" + n + " " + carrier);
		}
	}
	console.log("releasehook " + carrier);
	console.log("x-stitch-number 68");
	for (let n = max; n >= min; n -= 2) {
		console.log("knit - f" + n + " " + carrier);
	}
}

//cast on as:
//  v-- 1 --- v--- 3 ---
// v-- 0 --- v-- 2 ---
console.log("x-stitch-number 63");
Carriers.forEach(function(carrier, ci){
	let {min, max} = makeMinMax(0, ci);
	castOn(carrier, min, max);
	if (ci % 2 !== 0) {
		for (let n = min; n <= max; n += 2) {
			console.log("xfer f" + n + " b" + n);
		}
	}
});
console.log("x-stitch-number 68");



//skew odd sheets right and even sheets left:
//  v-- 1 --- v--- 3 ---
// v-- 0 --- v-- 2 ---
function addSkew(skew) {
	console.assert(skew + 1 <= Width / 2, "Cannot skew past width/2");

	//move everything to the front bed:
	//(some care in ordering taken given how kickbacks will work out)
	for (let ci = Carriers.length-1; ci >= 0; --ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== 'f') {
				let n = min + 2*s;
				console.log("xfer " + home[s] + n + " " + 'f' + n);
			}
		}
	}

	//starting from the right, shift each sheet in the correct direction and move to back bed:
	for (let ci = Carriers.length-1; ci >= 0; --ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);

		if (ci % 2 === 0) { //evens move left:
			console.log("rack +2");
			for (let s = 0; s < Width; ++s) {
				let n = min + 2*s;
				console.log("xfer " + 'f' + n + " " + 'b' + (n-2));
			}
		} else { //odds move right:
			console.log("rack -2");
			for (let s = 0; s < Width; ++s) {
				let n = min + 2*s;
				console.log("xfer " + 'f' + n + " " + 'b' + (n+2));
			}
		}
	}
	console.log("rack 0");

	//send everything to home positions:
	for (let ci = 0; ci < Carriers.length; ++ci) {
		let {min, max} = makeMinMax(skew+1, ci);
		let home = makeHome(skew+1, ci);
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== 'b') {
				let n = min + 2*s;
				console.log("xfer " + 'b' + n + " " + home[s] + n);
			}
		}
	}
}

function subSkew(skew) {
	console.assert(skew - 1 >= 0, "Cannot skew past 0");

	//move everything to the front bed:
	//(some care in ordering taken given how kickbacks will work out)
	for (let ci = Carriers.length-1; ci >= 0; --ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== 'f') {
				let n = min + 2*s;
				console.log("xfer " + home[s] + n + " " + 'f' + n);
			}
		}
	}

	//starting from the right, shift each sheet in the correct direction and move to back bed:
	for (let ci = Carriers.length-1; ci >= 0; --ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);

		if (ci % 2 === 0) { //evens move right:
			console.log("rack -2");
			for (let s = 0; s < Width; ++s) {
				let n = min + 2*s;
				console.log("xfer " + 'f' + n + " " + 'b' + (n+2));
			}
		} else { //odds move left:
			console.log("rack +2");
			for (let s = 0; s < Width; ++s) {
				let n = min + 2*s;
				console.log("xfer " + 'f' + n + " " + 'b' + (n-2));
			}
		}
	}
	console.log("rack 0");

	//send everything to home positions:
	for (let ci = 0; ci < Carriers.length; ++ci) {
		let {min, max} = makeMinMax(skew-1, ci);
		let home = makeHome(skew-1, ci);
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== 'b') {
				let n = min + 2*s;
				console.log("xfer " + 'b' + n + " " + home[s] + n);
			}
		}
	}
}


//knit all carriers right:
//  v-- 1 --- v--- 3 ---
// v-- 0 --- v-- 2 ---
function knitRight(skew) {
	for (let ci = Carriers.length-1; ci >= 0; --ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);
		let target = makeTarget(skew, ci);

		//expand sheet:
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== target[s]) {
				let n = min + 2*s;
				console.log("xfer " + home[s] + n + " " + target[s] + n);
			}
		}

		//knit sheet:
		for (let s = 0; s < Width; ++s) {
			let n = min + 2*s;
			console.log("knit + " + target[s] + n + " " + Carriers[ci]);
		}

		//stash sheet:
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== target[s]) {
				let n = min + 2*s;
				console.log("xfer " + target[s] + n + " " + home[s] + n);
			}
		}
	}
}

//knit all carriers left:
function knitLeft(skew) {
	for (let ci = 0; ci < Carriers.length; ++ci) {
		let {min, max} = makeMinMax(skew, ci);
		let home = makeHome(skew, ci);
		let target = makeTarget(skew, ci);

		//expand sheet:
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== target[s]) {
				let n = min + 2*s;
				console.log("xfer " + home[s] + n + " " + target[s] + n);
			}
		}

		//knit sheet:
		for (let s = Width-1; s >= 0; --s) {
			let n = min + 2*s;
			console.log("knit - " + target[s] + n + " " + Carriers[ci]);
		}

		//stash sheet:
		for (let s = 0; s < Width; ++s) {
			if (home[s] !== target[s]) {
				let n = min + 2*s;
				console.log("xfer " + target[s] + n + " " + home[s] + n);
			}
		}
	}
}

//knit front and back layers together, assuming carriers are on the left.
function knitTogether(skew) {
	if (skew === 0) {
		//  v-- 1 --- v--- 3 ---
		// v-- 0 --- v-- 2 ---
		for (let ci = Carriers.length-1; ci >= 0; --ci) {
			if (ci % 2 === 0) {
				let {min:min0, max:max0} = makeMinMax(skew, ci);
				let home0 = makeHome(skew, ci);
				let target0 = makeTarget(skew, ci);
				let {min:min1, max:max1} = makeMinMax(skew, ci+1);
				let home1 = makeHome(skew, ci+1);
				let target1 = makeTarget(skew, ci+1);
				//expand sheets:
				for (let s = 0; s < Width; ++s) {
					if (home0[s] !== target0[s]) {
						let n = min0 + 2*s;
						console.log("xfer " + home0[s] + n + " " + target0[s] + n);
					}
					if (home1[s] !== target1[s]) {
						let n = min1 + 2*s;
						console.log("xfer " + home1[s] + n + " " + target1[s] + n);
					}
				}

				//knit them both:
				for (let s = 0; s < Width; ++s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit + " + target0[s] + n0 + " " + Carriers[ci+1]);
					console.log("knit + " + target1[s] + n1 + " " + Carriers[ci+1]);
				}
				for (let s = 0; s < Width; ++s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit + " + target0[s] + n0 + " " + Carriers[ci]);
					console.log("knit + " + target1[s] + n1 + " " + Carriers[ci]);
				}
			}
		}

		for (let ci = 0; ci < Carriers.length; ++ci) {
			if (ci % 2 === 0) {
				let {min:min0, max:max0} = makeMinMax(skew, ci);
				let home0 = makeHome(skew, ci);
				let target0 = makeTarget(skew, ci);
				let {min:min1, max:max1} = makeMinMax(skew, ci+1);
				let home1 = makeHome(skew, ci+1);
				let target1 = makeTarget(skew, ci+1);

				//knit them both:
				for (let s = Width-1; s >= 0; --s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit - " + target1[s] + n1 + " " + Carriers[ci+1]);
					console.log("knit - " + target0[s] + n0 + " " + Carriers[ci+1]);
				}
				for (let s = Width-1; s >= 0; --s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit - " + target1[s] + n1 + " " + Carriers[ci]);
					console.log("knit - " + target0[s] + n0 + " " + Carriers[ci]);
				}

				//collapse sheets:
				for (let s = 0; s < Width; ++s) {
					if (home0[s] !== target0[s]) {
						let n = min0 + 2*s;
						console.log("xfer " + target0[s] + n + " " + home0[s] + n);
					}
					if (home1[s] !== target1[s]) {
						let n = min1 + 2*s;
						console.log("xfer " + target1[s] + n + " " + home1[s] + n);
					}
				}

			}
		}
	} else if (skew === Width/2) {
		//NOTE: this is "it seems to work" programming (copied from above):
		//            v-- 2 --- v--- 3 ---
		// v-- 0 --- v-- 1 ---
		for (let ci = Carriers.length-1; ci >= 0; --ci) {
			if (ci % 2 === 1 && ci + 1 < Carriers.length) {
				let {min:min0, max:max0} = makeMinMax(skew, ci);
				let home0 = makeHome(skew, ci);
				let target0 = makeTarget(skew, ci);
				let {min:min1, max:max1} = makeMinMax(skew, ci+1);
				let home1 = makeHome(skew, ci+1);
				let target1 = makeTarget(skew, ci+1);
				//expand sheets:
				for (let s = 0; s < Width; ++s) {
					if (home0[s] !== target0[s]) {
						let n = min0 + 2*s;
						console.log("xfer " + home0[s] + n + " " + target0[s] + n);
					}
					if (home1[s] !== target1[s]) {
						let n = min1 + 2*s;
						console.log("xfer " + home1[s] + n + " " + target1[s] + n);
					}
				}

				//knit them both:
				for (let s = 0; s < Width; ++s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit + " + target1[s] + n1 + " " + Carriers[ci+1]);
					console.log("knit + " + target0[s] + n0 + " " + Carriers[ci+1]);
				}
				for (let s = 0; s < Width; ++s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit + " + target1[s] + n1 + " " + Carriers[ci]);
					console.log("knit + " + target0[s] + n0 + " " + Carriers[ci]);
				}
			}
		}
		for (let ci = 0; ci < Carriers.length; ++ci) {
			if (ci % 2 === 1 && ci + 1 < Carriers.length) {
				let {min:min0, max:max0} = makeMinMax(skew, ci);
				let home0 = makeHome(skew, ci);
				let target0 = makeTarget(skew, ci);
				let {min:min1, max:max1} = makeMinMax(skew, ci+1);
				let home1 = makeHome(skew, ci+1);
				let target1 = makeTarget(skew, ci+1);

				//knit them both:
				for (let s = Width-1; s >= 0; --s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit - " + target0[s] + n0 + " " + Carriers[ci+1]);
					console.log("knit - " + target1[s] + n1 + " " + Carriers[ci+1]);
				}
				for (let s = Width-1; s >= 0; --s) {
					let n0 = min0 + 2*s;
					let n1 = min1 + 2*s;
					console.log("knit - " + target0[s] + n0 + " " + Carriers[ci]);
					console.log("knit - " + target1[s] + n1 + " " + Carriers[ci]);
				}

				//collapse sheets:
				for (let s = 0; s < Width; ++s) {
					if (home0[s] !== target0[s]) {
						let n = min0 + 2*s;
						console.log("xfer " + target0[s] + n + " " + home0[s] + n);
					}
					if (home1[s] !== target1[s]) {
						let n = min1 + 2*s;
						console.log("xfer " + target1[s] + n + " " + home1[s] + n);
					}
				}

			}
		}
	} else {
		console.error("Only valid skews for knitTogether are 0 and Width/2");
	}
	
}

let skew = 0;
for (let diamond = 0; diamond < Diamonds; ++diamond) {

	knitTogether(skew);

	for (; skew < Width/2; ++skew) {

		knitRight(skew);
		knitLeft(skew);
		knitRight(skew);
		knitLeft(skew);

		addSkew(skew);
	}

	knitTogether(skew);

	for (; skew > 0; --skew) {

		knitRight(skew);
		knitLeft(skew);
		knitRight(skew);
		knitLeft(skew);

		subSkew(skew);
	}
}

knitTogether(skew);


//knit a few remaining rows and remove:
for (let row = 0; row < 8; row += 2) {
	knitRight(skew);
	knitLeft(skew);
}

//knit last pass and carrier out:
for (let ci = Carriers.length-1; ci >= 0; --ci) {
	let {min, max} = makeMinMax(skew, ci);
	let home = makeHome(skew, ci);
	let target = makeTarget(skew, ci);

	//expand sheet:
	for (let s = 0; s < Width; ++s) {
		if (home[s] !== target[s]) {
			let n = min + 2*s;
			console.log("xfer " + home[s] + n + " " + target[s] + n);
		}
	}

	//knit sheet:
	for (let s = 0; s < Width; ++s) {
		let n = min + 2*s;
		console.log("knit + " + target[s] + n + " " + Carriers[ci]);
	}

	console.log("outhook " + Carriers[ci]);

	//stash sheet:
	for (let s = 0; s < Width; ++s) {
		if (home[s] !== target[s]) {
			let n = min + 2*s;
			console.log("xfer " + target[s] + n + " " + home[s] + n);
		}
	}
}

//drop everything:
for (let ci = Carriers.length-1; ci >= 0; --ci) {
	let {min, max} = makeMinMax(skew, ci);
	let home = makeHome(skew, ci);

	//drop sheet:
	for (let s = 0; s < Width; ++s) {
		let n = min + 2*s;
		console.log("drop " + home[s] + n);
	}
}
