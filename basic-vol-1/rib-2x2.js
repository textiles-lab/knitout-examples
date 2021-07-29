#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";

/*
  
  Seed stitch rectangle (though code is written to work for any front/back knit pattern)

*/
  
  
  const Carrier = ['1'];
const Width = 80
const Height = 120;
//pattern will be tiled to Width/Height:
  const Pattern = [
    'ffbb',
    'ffbb'
  ];



console.log(";!knitout-2")
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10")

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


console.log("x-stitch-number 102");

let on = [];
//all stitches start on front bed:
  for (let s = 0; s <= (max-min); ++s) {
    on.push('f');
  }

//build pattern:
  for (let r = 0; r < Height; ++r) {
    let target = [];
    const PatternRow = Pattern[Pattern.length - 1 - (r % Pattern.length)];
    for (let s = 0; s <= (max-min); ++s) {
      target.push(PatternRow[s % PatternRow.length]);
    }
    
    for (let n = min; n <= max; ++n) {
      if (on[n-min] !== target[n-min]) {
        console.log("xfer " + on[n-min] + n + " " + target[n-min] + n);
      }
    }
    on = target;
    
    if (r % 2 === 0) {
      for (let n = min; n <= max; ++n) {
        console.log("knit + " + on[n-min] + n + " " + Carrier);
      }
    } else {
      for (let n = max; n >= min; --n) {
        console.log("knit - " + on[n-min] + n + " " + Carrier);
      }
    }
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
