#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";

/*
  
  Seed stitch rectangle (though code is written to work for any front/back knit pattern)

*/
  
  
const Carrier = ['1'];
const Width = 80;
const Height = 120;
const Margin = 0;
//pattern will be tiled to Width/Height:
let Pattern;

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");
//HACK: put carriers a bit left of the right edge
console.log(";;Width: 530");
console.log(";;Position: Right");

const min = 1;
const max = Width;

//all-needle cast-on:
  function caston() {
    console.log("x-stitch-number 101");
    console.log("inhook " + Carrier);
    for (let n = max; n >= min; --n) {
      if ((max-n)%2 == 0) {
        console.log("knit - f" + n + " " + Carrier);
      }
    }
    for (let n = min; n <= max; ++n) {
      if ((max-n)%2 != 0) {
        console.log("knit + f" + n + " " + Carrier);
      }
    }
    console.log("x-stitch-number 102");
    for (let n = max; n >= min; --n) {
      console.log("knit - f" + n + " " + Carrier);
    }
    console.log("releasehook " + Carrier);
    
    for (let n = min; n <= max; ++n) {
      console.log("knit + f" + n + " " + Carrier);
    }
    
    for (let n = max; n >= min; --n) {
      console.log("knit - f" + n + " " + Carrier);
    }
  }
caston();

let on = [];
//all stitches start on front bed:
  for (let s = 0; s <= (max-min); ++s) {
    on.push('f');
  }

let dir = '+';
let r = 0;

function row(edges) {
    let target = [];
    const PatternRow = Pattern[Pattern.length - 1 - (r % Pattern.length)];
    for (let s = 0; s <= (max-min); ++s) {
      target.push(PatternRow[s % PatternRow.length]);
    }
	if (edges) {
		target[0] = 'f';
		target[target.length-1] = 'f';
	}
    
    for (let n = min; n <= max; ++n) {
      if (on[n-min] !== target[n-min]) {
        console.log("xfer " + on[n-min] + n + " " + target[n-min] + n);
      }
    }
    on = target;
    
    if (dir === '+') {
      for (let n = min; n <= max; ++n) {
        console.log("knit + " + on[n-min] + n + " " + Carrier);
      }
	  dir = '-';
    } else {
      for (let n = max; n >= min; --n) {
        console.log("knit - " + on[n-min] + n + " " + Carrier);
      }
	  dir = '+';
    }
	r += 1;
}

//build starting rib:
Pattern = [
	'ffbb',
	'ffbb'
];
for (let r = 0; r < Margin; ++r) {
	row(true);
}

//build pattern:
Pattern = [
	'ff',
	'ff'
];
for (let r = 0; r < Height; ++r) {
	row();
}

//build ending seed:
Pattern = [
	'ffbb',
	'ffbb'
];
for (let r = 0; r < Margin; ++r) {
	row(true);
}


//everything back to front bed for bind-off:
  for (let n = min; n <= max; ++n) {
    if (on[n-min] !== 'f') {
      console.log("xfer " + on[n-min] + n + " f" + n);
    }
  }

console.log("outhook " + Carrier);

//...but no bind off:
  for (let n = min; n <= max; ++n) {
    console.log("drop f" + n);
  }
