const blocks = [];
let canvasWidth = null;
let canvasHeight = null;
let ctx = null;

function randomDirection() {
	const roll = Math.random();
	if (roll < 0.5) {
		return -1;
	} else {
		return 1;
	};
}

class Block {
	constructor() {
		this.s = Math.floor(Math.random() * 10) + 5

		this.x = Math.floor(Math.random() * (canvasWidth - this.s))
		this.y = Math.floor(Math.random() * (canvasHeight - this.s))

		this.direction = {
			"x": randomDirection(),
			"y": randomDirection()
		}
		
		this.r = Math.floor(Math.random() * 155) + 100
		this.g = Math.floor(Math.random() * 155) + 100
		this.b = Math.floor(Math.random() * 155) + 100
	}
};

function drawBlock(block) {
	ctx.fillStyle = `rgb(${block.r},${block.g},${block.b})`;
	ctx.fillRect(block.x, block.y, block.s, block.s);
};

function changeDirection(block) {
	block.direction = {
		"x": randomDirection(),
		"y": randomDirection()
	}
}

function moveBlock(block) {
	const roll = Math.random();
	if (roll < 0.40) {
		changeDirection(block);
	};
	if (block.x + block.direction.x + block.s > canvasWidth || block.x + block.direction.x < 0) {
		changeDirection(block)
	};
	if (block.y + block.direction.y + block.s > canvasHeight || block.y + block.direction.y < 0) {
		changeDirection(block)
	};
	block.x = block.x + block.direction.x;
	block.y = block.y + block.direction.y;
};

function tick() {
	blocks.forEach(drawBlock)
	blocks.forEach(moveBlock)
};

function start() {
	for (let index = 0; index < 1000; index++) {
		block = new Block()
		blocks.push(block)
	}
};

window.onload = function() {
	const canvas = document.getElementById('canvas');
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx = canvas.getContext('2d');

	start()

	window.setInterval(tick, 1, ctx)
};
