
/*
 *
 * Knits a scarf of interlock fabric with horizontal stripes.
 * Each stripe is made by bringing in a yarn carrier, knitting with it, and taking the carrier out again.
 *
 * The width of the scarf is specified by the `Width` variable.
 * The stripes are given by the `Stripes` array, which consists of objects with members:
 *  - `Carrier` - the name of the carrier to make the stripe with
 *  - `Height` - the height of the stripe in rows (since this is interlock, two passes of knitting == one row)
 *
 * WARNING: this uses one of our "user defined" stitch numbers (102). I suggest setting this to 35/20 for thicker yarns (Tamm Petit) or 30/20 for thinner (Winning Rayon).
 *
 */

const Width = 60;
const Stripes = [
	{Carrier:"1", Height:40},
	{Carrier:"2", Height:40},
	{Carrier:"3", Height:40},
	{Carrier:"4", Height:40},
	{Carrier:"5", Height:40},
	{Carrier:"6", Height:40},
	{Carrier:"7", Height:40},
	{Carrier:"8", Height:40},
	{Carrier:"9", Height:40},
	{Carrier:"10", Height:40},
];


console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

console.log("x-stitch-number 102");

const min = 1;
const max = Width;

for (const stripe of Stripes) {
	console.log(`inhook ${stripe.Carrier}`);
	for (let row = 0; row < stripe.Height; ++row) {
		for (let n = max; n >= min; --n) {
			console.log(`knit - ${((max-n)%2 ? 'b' : 'f')}${n} ${stripe.Carrier}`);
		}
		for (let n = min; n <= max; ++n) {
			console.log(`knit + ${((max-n)%2 ? 'f' : 'b')}${n} ${stripe.Carrier}`);
		}
		//send yarn inserting hook out after first row:
		if (row == 0) {
			console.log(`releasehook ${stripe.Carrier}`);
		}
	}
	//take carrier out after stripe is done:
	console.log(`outhook ${stripe.Carrier}`);
}

for (let n = min; n <= max; ++n) {
	console.log(`drop f${n}`);
}
for (let n = min; n <= max; ++n) {
	console.log(`drop b${n}`);
}
