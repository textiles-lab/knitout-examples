#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
"use strict";

//This code attempts to take a knitout job and "rotate" it by switching the directions and beds of every operation:
// f <-> b
// fs <-> bs
// + <-> -
// needle N -> needle -N
// racking R -> -R

//Carrier names are adjusted by a map you supply; by default the map is the identity.

if (process.argv.length != 5) {
	console.error("Usage:\n\trotate-knitout.js <in.knitout> <'1->3,2->1,...'> <out.knitout>\n'Rotates' a knitout job by mapping:\n\t\t{f,fs} <-> {b,bs},\n\t\t'+' <-> '-',\n\t\tn -> -n,\n\t\tr -> -r.\n\tThe second parameter says how to map carrier names.\n");
	process.exitCode = 1;
	return;
}

const IN_FILE = process.argv[2];
const CARRIER_MAP = parseCarrierMap(process.argv[3]);
const OUT_FILE = process.argv[4];

function parseCarrierMap(str) {
	const map = {};
	if (str.trim() === '') return map;
	for (let pair of str.split(",")) {
		let m = pair.match(/^\s*([^\s]+)\s*->\s*([^\s+])\s*$/);
		if (!m) {
			throw new Error("Carrier map contained '" + pair + "' which doesn't appear to be a pair of carrier names separated by a '->'.");
		}
		if (m[1] in map && map[m[1]] !== m[2]) {
			throw new Error("Carier source '" + m[1] + "' is used twice with different destinations in the carrier map.");
		}
		map[m[1]] = m[2];
	}
	return map;
}

console.log("Will read from '" + IN_FILE + "', write result to '" + OUT_FILE + "', and use carrier map: '" + ((m)=>{
	let ret = ''
	for (let key of Object.keys(m)) {
		if (ret != '') ret += ', ';
		ret += key + ' -> ' + m[key];
	}
	return ret;
})(CARRIER_MAP) + "'")


function mapBed(bed) {
	if (bed === 'f') return 'b';
	else if (bed === 'b') return 'f';
	else if (bed === 'fs') return 'bs';
	else if (bed === 'bs') return 'fs';
	else throw new Error("Bed '" + bed + "' not recognized.");
}

function mapNeedle(n) {
	return -n;
}

function mapBedNeedle(bn) {
	const m = bn.match(/^([fb]s?)(-?\d+)$/);
	if (!m) throw new Error("Failed to parse needle identifier '" + bn + "'");
	return mapBed(m[1]) + mapNeedle(m[2]);
}

function mapDirection(d) {
	if (d === '+') return '-';
	else if (d === '-') return '+';
	else throw new Error("Direction '" + d + "' not recognized.");
}

function mapRack(r) {
	return -r;
}

function mapCarrier(cn) {
	if (cn in CARRIER_MAP) return CARRIER_MAP[cn];
	else throw new Error("Carrier '" + cn + "' not mentioned in carrier map.");
}

const fs = require('fs');

const out = [];


fs.readFileSync(IN_FILE, 'utf8').split('\n').forEach( (line, lineNumber) => {
	if (lineNumber === 0) {
		const m = line.match(/^;!knitout-(\d+)$/);
		if (!m) {
			throw new Error("Input file does not appear to be a knitout file.");
		}
		if (m[1] !== '2') {
			console.warn("WARNING: knitout file is version '" + m[1] + "' but this code expects version '2'.");
		}
		out.push(line);
		return;
	}

	let comment = '';
	//separate comment from rest of line:
	{
		let i = line.indexOf(';');
		if (i !== -1) {
			comment = line.substr(i);
			line = line.substr(0, i);
		}
	}
	//deal with instruction:
	if (line.trim() !== '') {
		//based on code from 'knitout-to-dat.js':
		//tokenize:
		let tokens = line.split(/[ ]+/);
		//trim potentially empty first and last tokens:
		if (tokens.length > 0 && tokens[0] === "") tokens.shift();
		if (tokens.length > 0 && tokens[tokens.length-1] === "") tokens.pop();

		let op = tokens.shift();

		if (op === 'in' || op === 'out' || op === 'inhook' || op === 'releasehook' || op === 'outhook') {
			//all arguments are carrier names, so map them:
			tokens = tokens.map(mapCarrier);
		} else if (op === 'knit' || op === 'tuck' || op === 'miss') {
			if (tokens.length < 2) throw new Error("'" + op + "' instruction should have at least two arguments");
			//looks like: op dir needle carriers
			tokens = [
				mapDirection(tokens[0]),
				mapBedNeedle(tokens[1]),
				...tokens.slice(2).map(mapCarrier)
			];
		} else if (op === 'split') {
			if (tokens.length < 2) throw new Error("'" + op + "' instruction should have at least three arguments");
			//looks like: op dir needle needle carriers
			tokens = [
				mapDirection(tokens[0]),
				mapBedNeedle(tokens[1]),
				mapBedNeedle(tokens[2]),
				...tokens.slice(3).map(mapCarrier)
			];
		} else if (op === 'drop' || op === 'amiss') {
			if (tokens.length !== 1) throw new Error("'" + op + "' instruction should have exactly one argument");
			//looks like: op needle
			tokens = [
				mapBedNeedle(tokens[0])
			];
		} else if (op === 'xfer') {
			if (tokens.length !== 2) throw new Error("'" + op + "' instruction should have exactly two arguments");
			//looks like: op needle needle
			tokens = [
				mapBedNeedle(tokens[0]),
				mapBedNeedle(tokens[1])
			];
		} else if (op === 'rack') {
			if (tokens.length !== 1) throw new Error("'" + op + "' instruction should have exactly one argument");
			tokens = [
				mapRack(tokens[0])
			];
		} else if (op === 'stitch' || op === 'x-speed-number' || op === 'x-stitch-number' || op === 'x-presser-mode') {
			//no transformation needed
		} else {
			console.log("Not transforming instruction '" + op + "'");
		}

		line = op;
		if (tokens.length) line += ' ' + tokens.join(' ');
		if (comment != '') line += ' ';
	}

	//output the transformed line:
	out.push(line + comment);
});

fs.writeFileSync(OUT_FILE, out.join('\n') + '\n', 'utf8');
console.log("Wrote output to '" + OUT_FILE + "'.");
