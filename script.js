const MAX_AGE = 10000;
const MATING_COOLDOWN = 5000;
const MAX_BLOCKS = 100;

let blocks = [];
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
	constructor(id) {
		this.id = id

		this.s = 25 //Math.floor(Math.random() * 50) + 10

		this.age = 0
		this.vitality = 0.9 + Math.random() / 10
		this.alive = true
		this.gender = Math.floor(Math.random() * 2)
		this.fertile = true

		this.x = Math.floor(Math.random() * (canvasWidth - this.s))
		this.y = Math.floor(Math.random() * (canvasHeight - this.s))

		this.direction = {
			"x": randomDirection(),
			"y": randomDirection()
		}
		
		this.r = Math.floor(Math.random() * 255)
		this.g = Math.floor(Math.random() * 255)
		this.b = Math.floor(Math.random() * 255)
	}
};

function areOverlapping(block1, block2) {
	return (block2.x > block1.x - block2.s + 1) && (block2.x < block1.x + block2.s - 1) &&
		(block2.y > block1.y - block2.s + 1) && (block2.y < block1.y + block2.s - 1)
}

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
	if (roll < 0.01) {
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

function checkOverlaps(block) {
	blocks.forEach(b => {
		if (b.id != block.id && areOverlapping(b, block)) {
			makeOffspring(block, b)
		}
	})
}

function makeOffspring(block1, block2) {
	if (block1.gender != block2.gender && block1.fertile && block2.fertile && blocks.length < MAX_BLOCKS) {
		const roll = Math.random();
		if (roll > 0.5) {
			block = new Block(blocks.length)
			block.x = block1.x
			block.y = block2.y

			const rollC = Math.random();
			if (rollC < 0.5) {
				block.r = block1.r
				block.g = block1.g
				block.b = block2.b
			} else {
				block.r = block2.r
				block.g = block2.g
				block.b = block1.b
			}

			block1.fertile = false
			block2.fertile = false

			window.setTimeout(restoreFertility, MATING_COOLDOWN, block1)
			window.setTimeout(restoreFertility, MATING_COOLDOWN, block2)

			blocks.push(block);
			console.log("A block was born. Population:", blocks.length)
		};
	}
}

function restoreFertility(block) {
	block.fertile = true;
}

function killBlock(block) {
	if (block.age * block.vitality > MAX_AGE) {
		roll = Math.random();
		if (roll < 0.50) {
			block.alive = false
			console.log("A block has died. Pupulation:", blocks.length)
		}
	}
}

function removeDeadBlocks() {
	blocks = blocks.filter(block => block.alive)
}

function ageBlock(block) {
	block.age = block.age + 1
}

function tick() {
	blocks.forEach(drawBlock)
	blocks.forEach(checkOverlaps)
	blocks.forEach(ageBlock)
	blocks.forEach(killBlock)
	removeDeadBlocks()
	blocks.forEach(moveBlock)
};

function start() {
	for (let index = 0; index < 25; index++) {
		block = new Block(index)
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
