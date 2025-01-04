#!/usr/bin/env node
import fs from 'fs';
import { PNG } from 'pngjs';
import sharp from 'sharp'; // Import sharp for image processing

if (process.argv.length < 3) {
    console.error("Usage:\n\fairisle-dog.js <image.png>");
    process.exit(1);
}

const imagePath = process.argv[2];

// Function to resize the image
function resizeImage(imagePath, maxHeight) {
    return sharp(imagePath)
        .metadata()
        .then(({ width, height }) => {
            // Calculate new dimensions while maintaining aspect ratio
            const scale = maxHeight / height;
            const newWidth = Math.round(width * scale);

            // Resize image and return as PNG buffer
            return sharp(imagePath)
                .resize(newWidth, maxHeight)
                .toBuffer();
        })
        .then(resizedImageBuffer => {
            return PNG.sync.read(resizedImageBuffer); // Return PNG object from buffer
        });
}

function imageToPattern(png) {
    const width = png.width;
    const height = png.height;
    const pattern = [];
    const threshold = 128; // Threshold for black/white conversion

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const idx = (png.width * y + x) << 2;
            const r = png.data[idx]; // Red channel (since it's greyscale, all channels are the same)
            row.push(r < threshold ? 1 : 0); // 'X' for black, '.' for white
        }
        pattern.push(row);
    }
    return pattern;
}

// Parameters
const Height = 48; // Total height of the knitting
const CarrierA = "3";
const CarrierB = "6";
/* const TestPattern = [
    [0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1]
]; // Example pattern */
const maxDis = 8;
const png = await resizeImage(imagePath, Height); // Resize the image
const TestPattern = imageToPattern(png);
const Width = TestPattern[0].length; // Total width of the knitting

// console.log(TestPattern);
// Knitout Header
console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");
console.log("x-stitch-number 63"); // Default stitch

const Wmin = 0;
const Wmax = Width - 1;

const carrierAt = [0,0];

function castOn(carrier) {
    console.log("inhook " + carrier);
    for (let s = Wmax; s >= Wmin; --s) {
        if ((Wmax - s) % 2 === 0) {
            console.log("tuck - f" + s + " " + carrier);
        }
    }
    for (let s = Wmin; s <= Wmax; ++s) {
        if ((Wmax - s) % 2 !== 0) {
            console.log("tuck + f" + s + " " + carrier);
        }
    }
}

function knitPlainRows(carrier, rows = 2) {
    for (let r = 0; r < rows; ++r) {
        if (r % 2 === 0) {
            for (let s = Wmax; s >= Wmin; --s) {
                console.log("knit - f" + s + " " + carrier);
            }
        } else {
            for (let s = Wmin; s <= Wmax; ++s) {
                console.log("knit + f" + s + " " + carrier);
            }
        }
    }
}

function bringCarrier(index, start, end, carrier, tuckOffset = 0) {
    if (Math.abs(start - end) >= maxDis) {
        const step = (start > end) ? -1 : 1;
        for (let i = start; i != end; i += step) {
            if ((i + tuckOffset) % maxDis == 0) {
                console.log(`tuck ${(step === -1) ? "-" : "+"} f${i} ${carrier}`); 
            }
        }
    }
}

function fairIsleRow(patternRow, carrierA, carrierB, reverse = false, rowIndex = 0) {
    const start = reverse ? Wmax : Wmin;
    const end = reverse ? Wmin - 1 : Wmax + 1;
    const step = reverse ? -1 : 1;

    const tuckOffsetA = rowIndex % maxDis; // Offset for carrier A based on the row index
    const tuckOffsetB = (rowIndex + 1) % maxDis; // Offset for carrier B (different alignment)

    // First pass: carrierA
    for (let s = start; s !== end; s += step) {
        if (patternRow[s % patternRow.length] === 1) {
            bringCarrier(0, carrierAt[0], s, carrierA, tuckOffsetA);
            console.log(`knit ${reverse ? "-" : "+"} f${s} ${carrierA}`);
            carrierAt[0] = s;
        } 
    }
    console.log(`miss ${reverse ? "-" : "+"} f${end+step} ${carrierA}`);

    // Second pass: carrierB
    for (let s = start; s !== end; s += step) {
        if (patternRow[s % patternRow.length] !== 1) {
            bringCarrier(1, carrierAt[1], s, carrierB, tuckOffsetB);
            console.log(`knit ${reverse ? "-" : "+"} f${s} ${carrierB}`);
            carrierAt[1] = s;
        }
    }
    console.log(`miss ${reverse ? "-" : "+"} f${end+step} ${carrierB}`);
}

function fairIsle(pattern, height, carrierA, carrierB) {
    for (let row = 0; row < height; ++row) {
        const reverse = row % 2 !== 1;
        const patternRow = pattern[row % pattern.length];
        fairIsleRow(patternRow, carrierA, carrierB, reverse, row);
    }
}

// Cast-on
castOn(CarrierA);

// Knit plain rows to stabilize the knitting
knitPlainRows(CarrierA);

console.log("releasehook " + CarrierA);
console.log("inhook " + CarrierB);

knitPlainRows(CarrierB);

console.log("releasehook " + CarrierB);

// Start Fair Isle knitting
fairIsle(TestPattern, Height, CarrierA, CarrierB);

knitPlainRows(CarrierB, 4);

// End knitting
console.log("outhook " + CarrierA);
console.log("outhook " + CarrierB);