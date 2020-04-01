const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// game vars and constants
let frames = 0;

let gameState = {
	current: 0,
	readyState: 0,
	gameState: 1,
	overState: 2,
}

let medalScore = {
	bronze: 5,
	silver: 10,
	gold: 20,
	platinum: 30
}

// sprite clip for bronze medal
const bronzeMedal = {
	sourceX: 361,
	sourceY: 159,
	w: 42,
	h: 42,
}

// sprite clip for silver medal
const goldMedal = {
	sourceX: 313,
	sourceY: 159,
	w: 42,
	h: 42,
}

// sprite clip for gold medal
const silverMedal = {
	sourceX: 361,
	sourceY: 113,
	w: 42,
	h: 42,
}

// sprite clip for platinum medal
const platinumMedal = {
	sourceX: 313,
	sourceY: 113,
	w: 41,
	h: 41,
}


const DEGREE = Math.PI/180;

// Source Sprite Image
const sprite = new Image();
sprite.src = "img/sprite.png";

// load audio files
const die = new Audio();
const flap = new Audio();
const hit = new Audio();
const point = new Audio();
const swoosh = new Audio();

die.src = "audio/sfx_die.wav";
flap.src = "audio/sfx_flap.wav";
hit.src = "audio/sfx_hit.wav";
point.src = "audio/sfx_point.wav";
swoosh.src = "audio/sfx_swooshing.wav";
const startBtn = {
	x: 120,
	y: 263,
	w: 83,
	h: 29
}


//game control
cvs.addEventListener("click", function(event){
	switch(gameState.current){
		case gameState.readyState:
			gameState.current = gameState.gameState;
			swoosh.play();
			flappy.speed = 0;
			// pipes.position = [];
			break;
		case gameState.overState:
			let rect = cvs.getBoundingClientRect();
			let clickX = event.clientX - rect.left;
			let clickY = event.clientY - rect.top;
			if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y 
				&& clickY <= startBtn.y + startBtn.h){
				pipes.position = [];
				score.value = 0;
				gameState.current = gameState.readyState;
			}
			break;
		case gameState.gameState:
			flappy.flap();
			break;
	}
})


document.addEventListener("keydown", function(event){
	switch(event.key){
		case "ArrowUp":
			if(gameState.current == gameState.gameState){
				flappy.flap();
			}
			break;
		case "Enter":
			if(gameState.current == gameState.overState){
				pipes.position = [];
				score.value = 0;
				gameState.current = gameState.readyState;
			} else if(gameState.current == gameState.readyState){
				gameState.current = gameState.gameState;
				swoosh.play();
				flappy.speed = 0;
			}
			break;
	}
	// if(gameState.current == gameState.gameState && event.key === "ArrowUp"){
	// 	flappy.flap();
	// }
	// if(gameState.current == gameState.overState && event.key === "Enter"){
	// 	pipes.position = [];
	// 	score.value = 0;
	// 	gameState.current = gameState.readyState;
	// }
	// if(gameState.current == gameState.readyState && event.key === "Enter"){
	// 	gameState.current = gameState.gameState;
	// 	flappy.speed = 0;
	// }
})


//background object
const background = {
	sourceX: 0,
	sourceY: 0,
	w: 275,
	h: 226,
	x: 0,
	y: cvs.height - 226,

	draw: function(){
		ctx.drawImage(sprite, this.sourceX, this.sourceX, this.w, this.h, this.x, this.y, this.w, this.h);
		// repeat background as the background does not fill up the canvas.
		ctx.drawImage(sprite, this.sourceX, this.sourceX, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
	}

}

//foreground object

const foreground = {
	sourceX: 276,
	sourceY: 0,
	w: 224,
	h: 112,
	x: 0,
	y: cvs.height-112,
	dx: 2,

	draw: function(){
		ctx.drawImage(sprite, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y, this.w, this.h);
		ctx.drawImage(sprite, this.sourceX, this.sourceY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
	},

	update: function(){
		if(gameState.current == gameState.gameState){
			this.x = (this.x - this.dx) % (this.w/2);
		}
	}
}

// get ready message object
const getReady = {
	sourceX: 0,
	sourceY: 228,
	w: 173,
	h: 152,
	x: (cvs.width - 173)/2,
	y: 80,

	draw: function(){
		if(gameState.current == gameState.readyState){
			ctx.drawImage(sprite, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y, this.w, this.h);
		}		
	}
}

// game over message object
const gameOver = {
	sourceX: 175,
	sourceY: 228,
	w: 225,
	h: 202,
	x: (cvs.width - 225)/2,
	y: 90,

	draw: function(){
		if(gameState.current == gameState.overState){
			ctx.drawImage(sprite, this.sourceX, this.sourceY, this.w, this.h, this.x, this.y, this.w, this.h);
			let medal = null;
			let bronzeRange = {min: 5, max: 9};
			let silverRange = {min: 10, max: 19};
			let goldRange = {min: 20, max: 29};
			let platinumRange = {min: 30};
			if(score.value >= bronzeRange.min && score.value <=bronzeRange.max){
				medal = bronzeMedal;
				// ctx.drawImage(sprite, medal.sourceX, medal.sourceY)
			} else if(score.value >= silverRange.min && score.value <=silverRange.max){
				medal = silverMedal;
			} else if(score.value >= goldRange.min && score.value <=goldRange.max){
				medal = goldMedal;
			} else if(score.value >= platinumRange.min){
				medal = platinumMedal;
			}
			if(medal != null){
				ctx.drawImage(sprite, medal.sourceX, medal.sourceY, medal.w, medal.h, 74, 177, medal.w, medal.h);
			}
		}
	}
}

// bird object
const flappy = {
	animationFrame : [
		{sourceX: 276, sourceY: 112},
		{sourceX: 276, sourceY: 139},
		{sourceX: 276, sourceY: 164},
		{sourceX: 276, sourceY: 139},
	],
	x: 50,
	y: 150,
	w: 34,
	h: 26,
	frame: 0,
	speed: 0,
	gravity: 0.25,
	jumpHeight: 4.6,
	rotation: 0,
	radius: 15,

	draw: function(){
		let bird = this.animationFrame[this.frame];
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(sprite, bird.sourceX, bird.sourceY, this.w, this.h, -this.w/2, -this.h/2, 
			this.w, this.h);
		ctx.restore();
	},

	update: function(){
		let period = gameState.current == gameState.readyState ? 10 : 5;
		this.frame += frames % period == 0 ? 1 : 0;
		this.frame = this.frame % this.animationFrame.length;
		if(gameState.current == gameState.readyState){
			this.y = 150;
			this.rotation = 0 * DEGREE;
		} else {
			this.speed += this.gravity;
			this.y += this.speed;

			if(this.y + this.h/2 >= cvs.height - foreground.h){
				this.y = cvs.height - foreground.h - this.h/2;
				// this.speed = 0;
				// this.frame = 1;
				if(gameState.current == gameState.gameState){
					die.play();
					gameState.current = gameState.overState;
				}
			}

			if(this.speed >= this.jumpHeight){
				this.rotation = 90 * DEGREE;
				this.frame = 1;
				// this.speed = 0;
			} else {
				this.rotation = -25 * DEGREE;
			}
		}
		
		// if(frames % 10 == 0){
		// 	this.frame += this.;
		// }
	},

	flap: function(){
		this.speed = -this.jumpHeight;
		flap.play();
	},
}

// pipe objects
const pipes = {
	position: [],
	topPipe: {
		sourceX: 553,
		sourceY: 0,
	},
	bottomPipe: {
		sourceX: 502,
		sourceY: 0,
	},
	w: 53,
	h: 400,
	gap: 85,
	dx: 2,
	x: cvs.width,
	maxYPos: -150,

	draw: function(){
		this.position.forEach((item, index) => {
			let topYPos = item.y;
			let bottomYPos = topYPos + this.h + this.gap;
			ctx.drawImage(sprite, this.topPipe.sourceX, this.topPipe.sourceY, this.w, this.h, item.x, topYPos, this.w, this.h);
			ctx.drawImage(sprite, this.bottomPipe.sourceX, this.bottomPipe.sourceY, this.w, this.h, item.x, bottomYPos, this.w, this.h);
		})
	},

	update: function(){
		if(gameState.current !== gameState.gameState){
			return;
		}
		if(frames%100 == 0){
			this.position.push({
				x: cvs.width,
				y: this.maxYPos * (Math.random() + 1)
			})
		}

		this.position.forEach((item, index, object) => {
			item.x -= this.dx;
			
			// collision detection for top pipe
			if(flappy.x + flappy.radius > item.x && flappy.x - flappy.radius < item.x + this.w && 
				flappy.y + flappy.radius > item.y && flappy.y - flappy.radius < item.y + this.h){
				hit.play();
				gameState.current = gameState.overState;
			}

			//collision detection for bottom pipe
			if(flappy.x + flappy.radius > item.x && flappy.x - flappy.radius < item.x + this.w && 
				flappy.y + flappy.radius > item.y+this.h+this.gap && flappy.y - flappy.radius < item.y+this.gap+this.h+this.h){
				hit.play();
				gameState.current = gameState.overState;
			}

			if(item.x+this.w <= (flappy.x - flappy.radius)){
			// if(item.x+this.w < 3){
				object.splice(index, 1);
				score.value = score.value + 1;
				point.play();
				score.best = Math.max(score.value, score.best);
				localStorage.setItem("best", score.best);
			}
		})
	}
}

const score = {
	best: parseInt(localStorage.getItem("best")) || 0,
	value: 0,

	draw: function(){
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#000";

		if(gameState.current == gameState.gameState){
			ctx.lineWidth = 2;
			ctx.font = "35px Teko";
			ctx.fillText(this.value, cvs.width/2, 50);
			ctx.strokeText(this.value, cvs.width/2, 50);
		} else if(gameState.current == gameState.overState){
			ctx.font = "25px Teko";
			ctx.fillText(this.value, 225, 186);
			ctx.strokeText(this.value, 225, 186);
			ctx.fillText(this.best, 225, 228);
			ctx.strokeText(this.best, 225, 228);
		}
	}
}

function draw(){
	ctx.fillStyle = "#70c5ce";
	ctx.fillRect(0, 0, cvs.width, cvs.height);
	background.draw();
	pipes.draw();
	foreground.draw();
	flappy.draw();
	getReady.draw();
	gameOver.draw();
	score.draw();
}

function update(){
	flappy.update();
	foreground.update();
	pipes.update();
}

function loop(){
	update();
	draw();
	frames++;

	requestAnimationFrame(loop);
}

loop();