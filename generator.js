/**
 * Base class for a dungeon generator.
 */
class DungeonGenerator {
    /**
     * Applies this generator's algorithm to a dungeon.
     * @param {Dungeon} dun - Dungeon to modify.
     */
    generate(dun) {
	// This is just an example.
	//
	// Generates a rectangular room of a given width and height at the
	// center of the grid.
	dun.clear();
	var w = getRandInt(1, 20);
	var h = getRandInt(1, 20);
	var start = new Point(w, h).mult(-0.5).floor();
	// Draw inside portion
	for (var xi = 0; xi < w; xi++) {
	    for (var yi = 0; yi < h; yi++) {
		var cursor = start.copy().add(new Point(xi, yi));
		dun.grid.setPoint(cursor, 1);
	    }
	}
	// Draw walls.
	for (var xi = 0; xi < w+2; xi++) {
	    var cursor = start.copy().add(new Point(xi-1, -1));
	    dun.grid.setPoint(cursor, 2);
	}
	for (var xi = 0; xi < w+2; xi++) {
	    var cursor = start.copy().add(new Point(xi-1, h));
	    dun.grid.setPoint(cursor, 2);
	}
	for (var yi = 0; yi < h; yi++) {
	    var cursor = start.copy().add(new Point(-1, yi));
	    dun.grid.setPoint(cursor, 2);
	}
	for (var yi = 0; yi < h; yi++) {
	    var cursor = start.copy().add(new Point(w, yi));
	    dun.grid.setPoint(cursor, 2);
	}
    }
}
