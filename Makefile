rectangle.knitout : rectangle.js
	./rectangle.js > rectangle.knitout

interlock.knitout : interlock.js
	./interlock.js > interlock.knitout

entrelac.knitout : entrelac.js
	./entrelac.js > entrelac.knitout

nontrelac.knitout : nontrelac.js
	./nontrelac.js > nontrelac.knitout

mosaic.knitout : mosaic.js
	./'$<' > '$@'

color_intarsia.knitout : color_intarsia.js
	./color_intarsia.js > color_intarsia.knitout

tube-heart.knitout : tube-heart.js
	./tube-heart.js > tube-heart.knitout

chain-link.knitout : chain-link.js
	./chain-link.js > chain-link.knitout

%.dat : %.knitout ../knitout-backend-swg/knitout-to-dat.js
	../knitout-backend-swg/knitout-to-dat.js '$<' '$@'
