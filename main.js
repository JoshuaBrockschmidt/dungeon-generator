var game = {
    start : function() {
	game.canvas = document.getElementById('myCanvas');
	game.dungeon = new Dungeon();
	/*
	// DEBUG
	for (var i = -16; i < 16; i++) {
	    game.dungeon.grid.setPoint(new Point(i, i-1), 1);
	    game.dungeon.grid.setPoint(new Point(i, i), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+1), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+2), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+3), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+4), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+5), 2);
	    game.dungeon.grid.setPoint(new Point(i, i+6), 1);
	    game.dungeon.grid.setPoint(new Point(i, 0), 1);
	    game.dungeon.grid.setPoint(new Point(0, i), 1);
	    game.dungeon.grid.setPoint(new Point(i, -1), 1);
	    game.dungeon.grid.setPoint(new Point(-1, i), 1);
	}
	// EOF DEBUG
	*/
	gen = new DungeonGenerator();
	gen.generate(game.dungeon);
	game.draw();
    },

    draw : function() {
	game.canvas.width = window.innerWidth;
	game.canvas.height = window.innerHeight;
	var context = game.canvas.getContext('2d');
	context.fillStyle = '#000000';
	context.fillRect(0, 0, game.canvas.width, game.canvas.height);
	game.dungeon.drawCenter(context);
    }
}

window.onload = game.start;
