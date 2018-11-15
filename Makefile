rectangle.knitout : rectangle.js
	./rectangle.js > rectangle.knitout

interlock.knitout : interlock.js
	./interlock.js > interlock.knitout

nontrelac.knitout : nontrelac.js
	./nontrelac.js > nontrelac.knitout

%.dat : %.knitout
	../knitout-backend-swg/knitout-to-dat.js '$<' '$@'
