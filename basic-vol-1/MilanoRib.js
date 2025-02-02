#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";

/*
  
  Seed stitch rectangle (though code is written to work for any front/back knit pattern)

*/
  
const Carrier = '1';
const Width = 80;
const Height = 180;
console.assert(Height % 3 == 0, 'this program assumes that if the width is not a multiple of three the loops will not allign');
console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

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

console.log(";-----------------------------------");

console.log('rack +0.25');

//build pattern:
  for (let r = 0; r < Height; r = r + 6) {
    for (let n = min; n <= max; ++n) {
      console.log("knit + " + 'f' + n + " " + Carrier);
      console.log("knit + " + 'b' + n + " " + Carrier);
    }
    for (let n = max; n >= min; --n) {
      console.log("knit - f" + n + " " + Carrier);
    }
    
    for (let n = min; n <= max; ++n) {
      console.log("knit + b" + n + " " + Carrier);
    }
    for (let n = max; n >= min; --n) {
        console.log("knit - " + 'b' + n + " " + Carrier);
        console.log("knit - " + 'f' + n + " " + Carrier);
    }
    for (let n = min; n <= max; ++n) {
      console.log("knit + f" + n + " " + Carrier);
    }
    for (let n = max; n >= min; --n) {
      console.log("knit - b" + n + " " + Carrier);
      
    }
  }

console.log("outhook " + Carrier);

//...but no bind off:
  for (let n = min; n <= max; ++n) {
    console.log("drop f" + n);
  }
for (let n = min; n <= max; ++n) {
  console.log("drop b" + n);
}

console.log('rack 0');

