//title: Interlock Sheet (plain javascript)
// Knit a sheet with alternating rows of back/front and front/back knits; effectively two [[1x1 rib]] sheets interlocked with each-other.

//Write header:
  console.log(';!knitout-2');
console.log(';;Machine: SWGN2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');

//Parameters:
  let min = 1; //needle number of left edge
  let max = 80; //needle number of right edge
  let rows = 120; //number of rows to knit
  let carrier = "3"; //carrier name
  
  //Because of its structure, interlock does not require a [[cast-on]].
  //Instead, we just bring the yarn in and start knitting:
    console.log(`inhook ${carrier}`);
  console.log(`x-stitch-number 102`);
  
  // ---- interlock sheet ----
    for (let r = 0; r <= rows; r += 1) {
      if (r % 2 === 0) {
        //Even, left-going row:
          for (let n = max; n >= min; n -= 1) {
            if (r === 0 && n === min) {
              //Skip the leftmost stitch in the first row to prevent leftmost column from unravelling:
                continue;
            }
            if ((max - n) % 2 === 0) {
              console.log(`knit - f${n} ${carrier}`);
            } else {
              console.log(`knit - b${n} ${carrier}`);
            }
          }
      } else {
        //Odd, right-going row:
          for (let n = min; n <= max; n += 1) {
            if ((max - n) % 2 === 0) {
              console.log(`knit + b${n} ${carrier}`);
            } else {
              console.log(`knit + f${n} ${carrier}`);
            }
          }
      }
      
      //The yarn inserting hook can stop holding the yarn tail after two rows have been knit:
        if (r === 1) {
          console.log(`releasehook ${carrier}`);
        }
    }
  
  // ---- take carrier out and drop remaining loops ----
    //Take carrier out with yarn inserting hook:
    console.log(`outhook ${carrier}`);
  
  //drop loops:
    for (let n = min; n <= max; n += 1) {
      console.log(`drop f${n}`);
      console.log(`drop b${n}`);
    }
  