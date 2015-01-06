var game = {
	cam: {
		x: 0,
		y: 1.8,
		z: -10
	},
	rot: {
		x: 0,
		y: 0,
		z: 0
	}
};

function to2dp(input) {
	return Math.round(input * 100) / 100;
}

var cube = {
	vert: [
		[-0.5,-0.5,-0.5], //0s
		[-0.5,-0.5,0.5], //1
		[-0.5,0.5,-0.5], //2
		[-0.5,0.5,0.5], //3w
		[0.5,-0.5,-0.5], //4
		[0.5,-0.5,0.5], //5
		[0.5,0.5,-0.5], //6
		[0.5,0.5,0.5], //7
	],
	ind: [
		[2,0],
		[0,4],
		[4,6],
		[6,2],
		[2,3],
		[6,7],
		[3,7],
		[5,7],
		[1,3],
		[1,5],
		[1,0],
		[5,4]
	]
};

var pyra = {
	vert: [
		[0,0.5,0], //0 top
		[-0.5,-0.5,-0.5], //1
		[-0.5,-0.5,0.5], //2
		[0.5,-0.5,-0.5], //3
		[0.5,-0.5,0.5], //4
	],
	ind: [
		[0,1],
		[0,2],
		[0,3],
		[0,4],
		[1,2],
		[1,3],
		[3,4],
		[4,2]
	]
};

var objects = [
	{mesh: cube, x: -1, y: 0, z: 0},
	{mesh: cube, x: -1, y: 0, z: 3},
	{mesh: cube, x: -1, y: 1, z: 3},
	{mesh: pyra, x:  1, y: 1, z: 0},
];

function tick(ce, c, dtime)
{
	function project(ax, ay, az)
	{
		var sx = Math.sin(game.rot.x);
		var sy = Math.sin(game.rot.y);
		var sz = Math.sin(game.rot.z);
		var cx = Math.cos(game.rot.x);
		var cy = Math.cos(game.rot.y);
		var cz = Math.cos(game.rot.z);
		var x  = ax - game.cam.x;
		var y  = - (ay - game.cam.y);
		var z  = az - game.cam.z;
		var dx = cy * (sz * y + cz * x) - sy * z;
		var dy = sx * (cy * z + sy * (sz * y + cz * x)) + cx * (cz * y - sz * x);
		var dz = cx * (cy * z + sy * (sz * y + cz * x)) - sx * (cz * y - sz * x);
		var ex = 0;
		var ey = 0;
		var ez = 1;
		return [
			((ez / dz) * dx - ex) * ce.width + ce.width / 2,
			((ez / dz) * dy - ey) * ce.width + ce.height / 2
		];
	}

	function draw(obj, x, y, z)
	{
		c.beginPath();
		for (var i=0; i < obj.ind.length; i++) {
			var ind = obj.ind[i];
			var one = project(x + obj.vert[ind[0]][0], y + obj.vert[ind[0]][1], z + obj.vert[ind[0]][2]);
			var two = project(x + obj.vert[ind[1]][0], y + obj.vert[ind[1]][1], z + obj.vert[ind[1]][2]);
			c.moveTo(x + one[0], y + one[1]);
			c.lineTo(x + two[0], y + two[1]);
		}
		
		c.strokeStyle = "white";
		c.stroke();
	}

	var draw_count = 0;
	for (var i = 0; i < objects.length; i++) {
		draw_count++;
		draw(objects[i].mesh, objects[i].x, objects[i].y, objects[i].z);
	}
	
	c.fillStyle = "white";
	engine.draw_fps();
	engine.add_label("Camera: (" + to2dp(game.cam.x) + ", " + to2dp(game.cam.y) + ", " + to2dp(game.cam.z) + ")");
	engine.add_label("Rendered " + draw_count + " / " + objects.length);

	var speedx = 0.05;
	var speedy = speedx;
	var speedz = speedx;
	if (getKey(65)) {
		game.cam.x += speedx * Math.sin(game.rot.y - Math.PI / 2);
		game.cam.z += speedx * Math.cos(game.rot.y - Math.PI / 2);
	}
	if (getKey(68)) {
		game.cam.x += speedx * Math.sin(game.rot.y + Math.PI / 2);
		game.cam.z += speedx * Math.cos(game.rot.y + Math.PI / 2);
	}
	if (getKey(87)) {
		game.cam.x += speedz * Math.sin(game.rot.y);
		game.cam.z += speedz * Math.cos(game.rot.y);
	}
	if (getKey(83)) {
		game.cam.x -= speedz * Math.sin(game.rot.y);
		game.cam.z -= speedz * Math.cos(game.rot.y);
	}
	if (getKey(16))
		game.cam.y -= speedy;
	if (getKey(32))
		game.cam.y += speedy;
		
	var rotspeedy = 0.015;
	var rotspeedx = 0.01;
	if (getKey(37))
		game.rot.y -= rotspeedy;
	if (getKey(39))
		game.rot.y += rotspeedy;
	if (getKey(38))
		game.rot.x += rotspeedx;
	if (getKey(40))
		game.rot.x -= rotspeedx;
		
	if (game.rot.x < -Math.PI / 3)
		game.rot.x = -Math.PI / 3;
		
	if (game.rot.x > Math.PI / 3)
		game.rot.x = Math.PI / 3;
}

function init()
{}