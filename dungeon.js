/* TODO:
 *    - Use Point more instead of bare x and y values.
 */

// Length of a (square) chunk's side.
const CHUNKSIZE = 200;

// Pixel size of tiles.
const TILESIZE = 10;

/**
 * Represents a 2D Cartesian coordinate.
 */
class Point {
    /**
     * Creates a new point.
     * @param {Number} x - X position of point.
     * @param {Number} y - Y position of point.
     */
    constructor(x, y) {
	this.x = x;
	this.y = y;
    }

    /**
     * Creates a string representation of a point.
     * @return {String} Stringified point.
     */
    toString() {
	var str = "(" + this.x + ", " + this.y + ")";
	return str;
    }

    /**
     * Creates a copy of the current point.
     * @return {Point} Copy of the current point. Modifying this Point will
     *    not modify the copied point.
     */
    copy() {
	var clone = new Point(this.x, this.y);

	return clone;
    }

    /**
     * Add the x and y values of one point to the x and y values of the
     * current point, respectively.
     * @param {Point} p - Point to add.
     * @return {Point} The current point, to allow for the stringing together
     *    of point manipulation operations.
     */
    add(p) {
	this.x += p.x;
	this.y += p.y;

	return this;
    }

    /**
     * Subtracts the x and y values of one point from the x and y values of the
     * current point, respectively.
     * @param {Point} p - Point to add.
     * @return {Point} The current point, to allow for the stringing together
     *    of point manipulation operations.
     */
    sub(p) {
	this.x -= p.x;
	this.y -= p.y;

	return this;
    }

    /**
     * Multiply the x and y values of the current point by a scalar.
     * @param {Number} m - The multiplier to multiply the x and y values by.
     * @return {Point} The current point, to allow for the stringing together
     *    of point manipulation operations.
     */
    mult(m) {
	this.x *= m;
	this.y *= m;

	return this;
    }

    /**
     * Floor each coordinate.
     * @return {Point} The current point, to allow for the stringing together
     *    of point manipulation operations.
     */
    floor(m) {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);

	return this;
    }
}

/**
 * A square chunk for a DungeonGrid. Chunks act as 4-way linked lists to
 * other chunks, pointing to chunks north, east, south and west of it.
 */
class DungeonGridChunk {
    /**
     * Create a chunk.
     * @param {Point} pos - The minimum number steps away from a main chunk.
     *    The direction of these steps is indicated by it's coordinates' signs.
     */
    constructor(pos) {
	this.north = null;
	this.east = null;
	this.south = null;
	this.west = null;
	this.pos = pos;
	this.grid = Array(CHUNKSIZE);
	for (var xi = 0; xi < CHUNKSIZE; xi++)
	    this.grid[xi] = new Array(CHUNKSIZE).fill(0);
    }

    /**
     * Draws chunk.
     * @param {CanvasRenderingContext2D} context - Context to draw chunk in.
     * @param {Point} offset - Offset in pixels (not grid point units).
     */
    draw(context, offset) {
	for (var xi = 0; xi < CHUNKSIZE; xi++) {
	    var row = this.grid[xi];
	    for (var yi = 0; yi < CHUNKSIZE; yi++) {
		var doColor = true;
		switch(this.grid[xi][yi]) {
		case 1: // Floor
		    context.fillStyle = '#c0c0c0';
		    break;
		case 2: // Wall
		    context.fillStyle = '#808080';
		    break;
		default:
		    var doColor = false;
		}
		if (doColor) {
		    var curX = offset.x + xi * TILESIZE;
		    var curY = offset.y + yi * TILESIZE;
		    context.fillRect(curX, curY, TILESIZE, TILESIZE);
		}
	    }
	}
    }
}

/**
 * Creates a grid for representing a dungeon's floor and walls.
 */
class DungeonGrid {
    /**
     * Create a grid.
     */
    constructor() {
	/* this.mainChunk will act as quadrant 1, as per a Cartesian
	   coordinate system, such that (0,0) corresponds to
	   this.mainChunk.grid[0][0]. Do note that not all pointers (north,
	   east, south and west) will be used, even if a chunk does conceptually
	   lie next to another chunk. This is due to the way DungeonGrid indexes
	   points.
	*/
	this.mainChunk = new DungeonGridChunk(new Point(0, 0));

	// Chunks are also stored in an unordered list to make drawing easier.
	this.chunks = [this.mainChunk];

	// Positive-most bound of chunks, measured in chunk-sized steps.
	this.upperBound = new Point(0, 0);

	// Negative-most bound of chunks, measured in chunk-sized steps.
	this.lowerBound = new Point(0, 0);
    }

    /**
     * Get the value of a point on the grid.
     * @param {Point} pos - Coordinate of a point.
     */
    getPoint(pos) {
	var cursor = this.mainChunk;
	var curPos = pos.copy();

	// Move along the x-axis.
	while (true) {
	    if (curPos.x >= CHUNKSIZE) {
		cursor = cursor.east;
		curPos.x -= CHUNKSIZE;
	    }
	    else if (curPos.x <= 0) {
		cursor = cursor.west;
		curPos.x += CHUNKSIZE;
	    }
	    else {
		break;
	    }
	    if (cursor === null)
		// Chunks do not reach this far. Return 0 as it is the default
		// value of new points.
		return 0;
	}

	// Move along the y-axis.
	while (true) {
	    if (curPos.y >= CHUNKSIZE) {
		cursor = cursor.north;
		curPos.y -= CHUNKSIZE;
	    }
	    else if (curPos.y <= 0) {
		cursor = cursor.south;
		curPos.y += CHUNKSIZE;
	    }
	    else {
		break;
	    }
	    if (cursor === null)
		// Chunks do not reach this far. Return 0 as it is the default
		// value of new points.
		return 0;
	}

	return cursor.grid[curPos.x][curPos.y];
    }

    /**
     * Set the value of a point on the grid.
     * @param {Point} pos - Coordinate of point.
     * @param {Number} val - Value of point.
     */
    setPoint(pos, val) {
	var cursor = this.mainChunk;
	var gridPos = pos.copy();

	// Move along the x-axis.
	while (true) {
	    if (gridPos.x >= CHUNKSIZE) {
		gridPos.x -= CHUNKSIZE;
		if (cursor.east === null) {
		    var xSteps = Math.floor((pos.x - gridPos.x) / CHUNKSIZE);
		    cursor.east = new DungeonGridChunk(new Point(xSteps, 0));
		    this.chunks.push(cursor.east);
		}
		cursor = cursor.east;
	    }
	    else if (gridPos.x < 0) {
		gridPos.x += CHUNKSIZE;
		if (cursor.west === null) {
		    var xSteps = Math.floor((pos.x - gridPos.x) / CHUNKSIZE);
		    cursor.west = new DungeonGridChunk(new Point(xSteps, 0));
		    this.chunks.push(cursor.west);
		}
		cursor = cursor.west;
	    }
	    else {
		break;
	    }
	}

	// Move along the y-axis.
	var xSteps = Math.floor(pos.x / CHUNKSIZE);
	while (true) {
	    if (gridPos.y >= CHUNKSIZE) {
		gridPos.y -= CHUNKSIZE;
		if (cursor.north === null) {
		    var ySteps = Math.floor((pos.y - gridPos.y) / CHUNKSIZE);
		    cursor.north = new DungeonGridChunk(new Point(xSteps, ySteps));
		    this.chunks.push(cursor.north);
		}
		cursor = cursor.north;
	    }
	    else if (gridPos.y < 0) {
		gridPos.y += CHUNKSIZE;
		if (cursor.south === null) {
		    var ySteps = Math.floor((pos.y - gridPos.y) / CHUNKSIZE);
		    cursor.south = new DungeonGridChunk(new Point(xSteps, ySteps));
		    this.chunks.push(cursor.south);
		}
		cursor = cursor.south;
	    }
	    else {
		break;
	    }
	}

	if (xSteps > this.upperBound.x)
	    this.upperBound.x = xSteps;
	else if (xSteps < this.lowerBound.x)
	    this.lowerBound.x = xSteps;
	var ySteps = Math.floor(pos.y / CHUNKSIZE);
	if (ySteps > this.upperBound.y)
	    this.upperBound.y = ySteps;
	else if (ySteps < this.lowerBound.y)
	    this.lowerBound.y = ySteps;

	cursor.grid[gridPos.x][gridPos.y] = val;
    }

    /**
     * Find the approximate center of the grid by averaging the center points
     * of the chunks.
     * @return {Point} Approximate center in grid point units.
     */
    findCenter() {
	var sum = new Point(0, 0);
	this.chunks.forEach(function(chunk) {
	    sum.add(chunk.pos);
	});
	// Find average and offset it accordingly (chunk positions are
	// negative-most corners).
	var center = sum.mult(1 / this.chunks.length).add(new Point(0.5, 0.5));
	// Scale from chunk units to grid units.
	center.mult(CHUNKSIZE);
	return center;
    }

    /**
     * Draws grid.
     * @param {CanvasRenderingContext2D} context - Context to draw grid in.
     * @param {Point} offset - Offset in pixels (not grid point units).
     */
    draw(context, offset) {
	this.chunks.forEach(function(chunk) {
	    var chunkOffset = chunk.pos.copy().mult(CHUNKSIZE * TILESIZE).add(offset);
	    chunk.draw(context, chunkOffset);
	});
    }
}

/**
 * Stores dungeon data.
 */
class Dungeon {
    /**
     * Creates new dungeon.
     */
    constructor() {
	this.grid = new DungeonGrid();
    }

    /**
     * Clears the dungeon's grid.
     */
    clear() {
	this.grid = new DungeonGrid();
    }

    /**
     * Draw the dungeon.
     * @param {CanvasRenderingContext2D} context - Context to draw dungeon in.
     * @param {Point} offset - Offset in pixels (not grid point units).
     */
    draw(context, offset) {
	this.grid.draw(context, offset);
    }

    /**
     * Draw dungeon in the middle of the canvas.
     * @param {CanvasRenderingContext2D} context - Context to draw dungeon in.
     */
    drawCenter(context) {
	var gridCenter = this.grid.findCenter();
	var offset = new Point(context.canvas.width, context.canvas.height);
	offset.mult(0.5);
	offset.sub(gridCenter.mult(TILESIZE));
	// Floor offset to avoid creating unwanted artifacts.
	offset.floor();
	this.draw(context, offset);
    }
}
