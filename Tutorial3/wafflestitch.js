//import the knitout writer code and instantiate it as an object
var knitout = require('../../knitout-frontend-js/knitout');
k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');

// swatch variables
//height needs to be multiples of 4
var height = 40;
//width needs to be multiples 3 plus 1
//and for this implementation to avoid knit on the last one tucked on
//width must be even
var width = 40;
var carrier = '6';
// bring in carrier using yarn inserting hook
k.inhook(carrier);

//helper functions for rows
function row1()
{
  for (var s=width; s>0; s--)
  {
    if (s%3!=1)
    {
      k.knit("-", "b"+s, carrier);
    }
    else
    {
      k.knit("-", "f"+s, carrier);
    }
  }
}

function row2()
{
  for (var s=1; s<=width; s++)
  {
    if (s%3!=1)
    {
      k.knit("+", "b"+s, carrier);
    }
    else
    {
      k.knit("+", "f"+s, carrier);
    }
  }
  for (var s = width; s>0; s--)
  {
    if (s%3!=1)
    {
      k.xfer("b"+s, "f"+s);
    }
  }
}

function row3()
{
  for (var s=width; s>0; s--)
  {
      k.knit("-", "f"+s, carrier);
  }
}

function row4()
{
  for (var s=1; s<=width; s++)
  {
      k.knit("+", "f"+s, carrier);
  }
  for (var s=width; s>0; s--)
  {
    if (s%3!=1)
    {
      k.xfer("f"+s, "b"+s);
    }
  }
 }


//tuck on alternate needles and tuck the rest on the way back
for (var s = width ; s>0 ; s--)
{
  if (s%2 == 0)
  {
    if (s%3 != 1)
    {
      k.tuck("-", "b"+s, carrier);
    }
    else
    {
      k.tuck("-", "f"+s, carrier);
    }
  }
}

for (var s = 1 ; s<=width ; s++)
{
  if (s%2 != 0)
  {
    if (s%3 != 1)
    {
      k.tuck("+", "b"+s, carrier);
    }
    else
    {
      k.tuck("+", "f"+s, carrier);
    }
  }
}

// release the yarn inserting hook
k.releasehook(carrier);

for(var h = 1 ; h <= height ; h = h+4)
{
  row1();
  row2();
  row3();
  row4();
}

// bring the yarn out with the yarn inserting hook
k.outhook(carrier);

// write the knitout to a file
k.write('../../swatches/wafflestitch.k');
