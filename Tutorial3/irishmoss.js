//import the knitout writer code and instantiate it as an object
var knitout = require('../../knitout-frontend-js/knitout');
k = new knitout.Writer({carriers:['1', '2', '3', '4', '5', '6', '7', '8']});

// add some headers relevant to this job
k.addHeader('Machine','SWGXYZ');
k.addHeader('Gauge','15');

// swatch variables
//height needs to be multiples of 4
var height = 40;
//width needs to be multiples 2,
var width = 41; //want to put the first tuck in front, hack for now: +1
var carrier = '6';
// bring in carrier using yarn inserting hook
k.inhook(carrier);


//helper functions for rows
function row1()
{
  for (var s=width; s>0; s--)
  {
    if (s%2==0)
    {
      k.knit("-", "b"+s, carrier);
    }
    else
    {
      k.knit("-", "f"+s, carrier);
    }
  }
  for (var s = 1; s<=width; s++)
  {
    if(s%2 == 0)
    {
      k.xfer("b"+s, "f"+s);
    }
    else
    {
      k.xfer("f"+s, "b"+s);
    }
  }
}

function row2()
{
  for (var s=1; s<=width; s++)
  {
    if (s%2==0)
    {
      k.knit("+", "f"+s, carrier);
    }
    else
    {
      k.knit("+", "b"+s, carrier);
    }
  }
}

function row3()
{
  for (var s=width; s>0; s--)
  {
    if (s%2==0)
    {
      k.knit("-", "f"+s, carrier);
    }
    else
    {
      k.knit("-", "b"+s, carrier);
    }
  }
  for (var s = 1; s<=width; s++)
  {
    if(s%2 == 0)
    {
      k.xfer("f"+s, "b"+s);
    }
    else
    {
      k.xfer("b"+s, "f"+s);
    }
  }
}

function row4()
{
  for (var s=1; s<=width; s++)
  {
    if (s%2==0)
    {
      k.knit("+", "b"+s, carrier);
    }
    else
    {
      k.knit("+", "f"+s, carrier);
    }
  }
}


//tuck on all needles
for (var s=width; s>0; s--)
{
  if(s%2==0)
  {
    k.tuck("-", "b"+s, carrier);
  }
  else
  {
    k.tuck("-", "f"+s, carrier);
  }
}

//rib on way back, skip last of the tucks
for (var s=2; s<=width; s++)
{
  if (s%2==0)
  {
    k.knit("+", "b"+s, carrier);
  }
  else
  {
    k.knit("+", "f"+s, carrier);
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
k.write('../../swatches/irishmoss.k');
