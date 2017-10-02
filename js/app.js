"use strict";
/* variable which prevents the entities to render and update themselves automatically.
 * this variable will become true only when you click on the starGame button.which is
 * reqired to start timer,rendering of objects and player movements.
 */
var play = false;
// timer function global variable
var minutes = 1;
var seconds = 30;
var clearTimer = null;
var timeDiv = document.getElementById('timer');
var scoreDiv = document.getElementById("score");
var livesDiv = document.getElementById("lives");

/*
 * gameTiming() controls the functionality related to the timing.
 * clearMessage() clears the message at the top part of the canvas.
 * scoreCard(gameEvent) displays the different events and the according to that event score & lives.
*/

function gameTiming() {
    seconds -= 1;
    //loop that defines the game over and decrement in time conditions.
    if (seconds === 0 && minutes === 0) {
        console.log("game over !!");
        seconds = 0;
        minutes = 0;
        clearInterval(clearTimer);
        scoreCard(0);

    } else if (seconds == 0) {
        // decrement minute reset seconds
        minutes -= 1;
        seconds = 60;
    } else {
        timeDiv.innerHTML = '<h3>Minutes: ' + minutes + ' Seconds: ' + seconds + '</h3>';
    }
}

function scoreCard(gameEvent) {

    switch (gameEvent) {
        //defines the condition of collision with bugs.
        case -1:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.fillText("COLLISION!!!", 250, 45);
            resetCollectables();
            break;
            //defines the game over condition.
        case 0:
            player.score = 0;
            player.lives = 0;
            scoreDiv.innerHTML = player.score;
            livesDiv.innerHTML = player.lives;
            ctx.font = "36px Impact";
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            clearMessage();
            clearInterval(clearTimer);
            ctx.fillText("GAME OVER!!!", 250, 45);
            play = false;
            break;
            //defines the condition for collection of gems.
        case 1:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "orange";
            ctx.fillText("BONUS!!!", 250, 45);
            player.score = player.score + 50;
            scoreDiv.innerHTML = player.score;
            resetCollectables();
            break;
            //defines the condition of collection of stars.
        case 2:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "blue";
            ctx.fillText("STARBOY !!", 70, 45);
            player.score += 50;
            scoreDiv.innerHTML = player.score;
            resetCollectables();
            break;
            //defines the game winning situation.
        case 3:
            ctx.font = "36px Impact";
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.strokeStyle = "black";
            clearMessage();
            clearInterval(clearTimer);
            ctx.fillText("You Won!!!", 250, 45);
            play = false;
            break;
            //defines the condition of returning of player to it's initial position.
        case 4:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("AGAIN !!", 250, 45);
            player.score += 100;
            scoreDiv.innerHTML = player.score;
            player.x = 202;
            player.y = 415;
            if (player.lives >= 1) {
                player.lives = player.lives;
                livesDiv.innerHTML = player.lives;
                resetCollectables();
            }
            break;
            //defines the condition of collection of hearts.
        case 5:
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("HEART !!!", 450, 45);
            player.lives = player.lives + 1;
            livesDiv.innerHTML = player.lives;
            resetCollectables();
            break;
    }
    setTimeout(clearMessage, 6000);
}

function clearMessage() {
        // clears the canvas display.
        ctx.clearRect(0, 0, 505, 50);
    }
    /* It is required that every time when we start the game,first click on startGame button.
     * In case of game over,winning condition or between the game if you want you can click
     * on the newGame button to start the fresh game.
    */
    //Buttons for startGame and newGame.
var newGameButton = document.getElementById('newGame');
var startGameButton = document.getElementById('startGame');

//Event which handles the functionality for the newgame.
function newGameLoad() {
        newGameButton.addEventListener('click', newGame);
    }
    /* Function which initial the newgame.this function calls function which
       reset the position of player & initialize the timer again.
    */
function newGame() {
        player.resetGame();
        clearInterval(clearTimer);
        // start new timer
        timeDiv.innerHTML = '';
        // reset time count
        seconds = 30;
        minutes = 1;
        clearTimer = setInterval(gameTiming, 1000);
        play = true;
    }
    /* Function which will start the game and set our 'play' variable equals to true,which will
     * then make object rendering and updating possible.
     */
function startGame() {
        timeDiv.innerHTML = '';
        clearTimer = setInterval(gameTiming, 1000);
        // prevent start game button from being used again
        startGameButton.removeEventListener('click', startGame);
        // add new game click listener
        newGameLoad();
        play = true;
    }
    //event which is required for initialization of our game.
startGameButton.addEventListener('click', startGame);

//Function responsible for the resetting different entities when some event happen.
function resetCollectables() {
    gem.reset();
    heart.reset();
    star.reset();
    rock.reset();
}

// Enemies our player must avoid
var Enemy = function(y) {
    // Variables applied to each of our instances of bug
    this.x = Math.floor((Math.random() * 1500) + 100) * (-1);
    console.log("start point:" + this.x);
    this.y = y;
    this.speed = Math.floor((Math.random() * 50) + 150);
    //provided functionality to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Updating the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // this will multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < 700) {

        this.x = this.x + (this.speed) * dt;
    } else {
        this.speed = Math.floor((Math.random() * 100) + 100);
        this.x = -100;

    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*Player class which handles all the functionality related to player instance.
 * This class requires an update(), render() and a handleInput() method.
 */
var Player = function() {
    //Initial position of our player.
    this.x = 202;
    this.y = 415;
    this.sprite = 'images/char-boy.png';
    //Initial score and lives of our player.
    this.score = 0;
    this.lives = 3;
    scoreDiv.innerHTML = this.score;
    livesDiv.innerHTML = this.lives;
};
//Player's update method consist of condition of game loosing and winning.
Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
    if (this.lives === 0) {
        scoreCard(0);
    }
    if (this.score >= 2500) {
        scoreCard(3);
    }
};
//Required for rendering player on the canvas.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/* resetGame resets the player position,score & lives.
 * It also reset the different game objects like stars,rocks,gems and hearts.
 */
Player.prototype.resetGame = function() {
    this.x = 202;
    this.y = 415;
    this.score = 0;
    this.lives = 3;
    resetCollectables();
    console.log("Game is reset !!");
    scoreDiv.innerHTML = this.score;
    console.log("score is" + this.score);
    livesDiv.innerHTML = this.lives;
    console.log("lives is" + this.lives);
};

/*handleInput fuction defines the varios player movement
 * according to which key user press.
 */
Player.prototype.handleInput = function(obj) {
    if (play === true) {
        if (this.x > 0) {
            /* if left key is pressed move player to it's left by decresing it's X position value,
             * knowing that player does not moveoff the canvas.
             */
            if (obj === 'left') {
                if (this.allowableSpace(obj)) {
                    this.x = this.x - 101;
                }
            }
        }

        if (this.x <= 303) {
            if (obj === 'right') {
                /*if right key is pressed move player to it's right by incrising it's X position value,
                 * knowing that player does not moveoff the canvas.
                 */
                if (this.allowableSpace(obj)) {
                    this.x = this.x + 101;
                }
            }
        }

        if (this.y >= 68) {
            if (obj === 'up') {
                /* if up key is pressed move player upside by decrising it's Y position value,
                 * knowing that player does not moveoff the canvas.
                 */
                if (this.allowableSpace(obj)) {
                    this.y = this.y - 83;
                }
            }
        }
        if (this.y < 400) {
            if (obj === 'down') {
                /* if down key is pressed move player downside by incrising it's Y position value,
                 * knowing that player does not moveoff the canvas.
                 */
                if (this.allowableSpace(obj)) {
                    this.y = this.y + 83;
                }
            }
        }
        if (this.y < 68) {
            //when player will be at top of the canvas,touching the water, player should return to it's original position.
            scoreCard(4);
        }
        console.log("Player x:" + this.x + " Player y:" + this.y);
    }
};

/*Function responsible for the space for our player object.it also consist condition for the collection of different entities.*/
Player.prototype.allowableSpace = function(direction) {
    var leftFull = false;
    var rightFull = false;
    var upFull = false;
    var downFull = false;
    if (this.lives != 0) {
        //conditions which defines that in case of rock player can't move on the rocks, by preventing the player movement on canvas.
        if (this.x + 101 === rock.x && this.y === rock.y) {
            rightFull = true;
        }
        if (this.x === rock.x + 101 && this.y === rock.y) {
            leftFull = true;
        }
        if (this.x === rock.x && this.y + 83 === rock.y) {
            downFull = true;
        }
        if (this.x === rock.x && this.y === rock.y + 83) {
            upFull = true;
        }
    } //end of this.lives!= 0

    switch (direction) {
        case ("left"):
            if (leftFull) {
                return false;
            } else {
                return true;
            }
            break;
        case ("right"):
            if (rightFull) {
                return false;
            } else {
                return true;
            }
            break;
        case ("up"):
            if (upFull) {
                return false;
            } else {
                return true;
            }
            break;
        case ("down"):
            if (downFull) {
                return false;
            } else {
                return true;
            }
            break;
        default:
            return true;
    }
};

//Rock class consisting functionality related rock object's initial position &image.
var Rock = function() {
    this.x = Math.floor((Math.random() * 5)) * 101;
    this.y = (Math.floor(Math.random() * 3) + 1) * 83;
    this.sprite = 'images/Rock.png';
};

//method required for rendering the rock object on the canvas.
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//updation in rock's position every time of initialition of game.
Rock.prototype.update = function() {
    var self = this;
    var rockX;
    var rockY;
    rockX = Math.floor((Math.random() * 2) + 0) * 101;
    rockY = (Math.floor((Math.random() * 5) + 1) * 83);
    //checking the boundary of the canvas
    if (rockX < 606 && rockX > 505 && rockY < 606 && rockY > 505) {
        self.x = rockX;
        self.y = rockY;
    }
};

//resetting rock's position in case of different scenerios like game reset,collection of stars, gems,hearts.
Rock.prototype.reset = function() {
    this.y = Math.floor(Math.random() * 1 + 3) * 83;
    this.x = Math.floor(Math.random() * 2 + 3) * 101;
};

//Heart class with the functionality related to the heart's object.
var Heart = function() {
    this.x = Math.floor((Math.random() * 4)) * 101;
    this.y = (Math.floor(Math.random() * 2) + 1) * 83;
    this.sprite = 'images/Heart.png';
    console.log("Heart's X Position :" + this.x, "Heart's Y Position :" + this.y);
};

//updation in heart's position every time of initialition of game.
Heart.prototype.update = function() {
    var self = this;
    var heartX;
    var heartY;
    heartX = Math.floor((Math.random() * 2) + 0) * 101;
    heartY = (Math.floor((Math.random() * 4) + 1) * 83);
    //checking the boundary of the canvas
    if (heartX < 606 && heartX > 505 && heartY < 606 && heartY > 505) {
        self.x = heartX;
        self.y = heartY;
    }
};

//resetting heart's position in case of different scenerios like game reset,collection of stars, gems,hearts.
Heart.prototype.reset = function() {
    this.y = Math.floor(Math.random() * 3 + 1) * 83; // resets gem to different points on canvas
    this.x = Math.floor(Math.random() * 5 + 2) * 101;
    console.log("Heart's Reset X Position :" + this.x, "Heart's Reset y Position :" + this.y);
};

//method required for rendering the heart object on the canvas.
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Gem class with the functionality related to the gem's object.
var Gem = function() {
    this.x = Math.floor((Math.random() * 3)) * 101;
    this.y = (Math.floor(Math.random() * 2) + 3) * 41.5;
    this.sprite = 'images/Gem Blue.png';
    console.log("Gems's X Position :" + this.x, "Gems's Y Position :" + this.y);
};

//updation in gem's position every time of initialition of game.
Gem.prototype.update = function() {
    var self = this;
    var gemX;
    var gemY;
    gemX = Math.floor((Math.random() * 3) + 1) * 101;
    gemY = (Math.floor((Math.random() * 3) + 4) * 83);
    //checking the boundary of the canvas
    if (gemX < 606 && gemX > 505 && gemY < 606 && gemY > 505) {
        self.x = gemX;
        self.y = gemY;
    }

};

//resetting gem's position in case of different scenerios like game reset,collection of stars, gems,hearts.
Gem.prototype.reset = function() {
    //
    this.y = Math.floor(Math.random() * 1 + 1) * 83; // resets gem to different points on canvas
    this.x = Math.floor(Math.random() * 4 + 2) * 101;
    console.log("Gem's Reset X Position :" + this.x, "Gem's Reset Y Position :" + this.y);
};

//method required for rendering the gem's object on the canvas.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Star class with the functionality related to the star's object.
var Star = function() {
    this.x = 403;
    this.y = 203;
    this.sprite = 'images/star.png';
    console.log("Star's X Position :" + this.x, "Star's Y Position :" + this.y);
};

//updation in star's position every time of initialition of game.
Star.prototype.update = function() {
    var self = this;
    var starX;
    var starY;
    starX = Math.floor((Math.random() * 2) + 3) * 101;
    starY = Math.floor((Math.random() * 3) + 1) * 83;
    //checking the boundary of the canvas
    if (starX < 606 && starX > 505 && starY < 606 && starY > 505) {
        self.x = starX;
        self.y = starY;
    }
};

//resetting star's position in case of different scenerios like game reset,collection of stars, gems,hearts.
Star.prototype.reset = function() {
    this.y = Math.floor(Math.random() * 2 + 1) * 83; // resets gem to different points on canvas
    this.x = Math.floor(Math.random() * 4 + 2) * 101;
    console.log("Star's Reset X Position :" + this.x, "Star's Reset Y Position :" + this.y);
};

//method required for rendering the star object on the canvas.
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//initialition of rock object.
var rock = new Rock();

//initialition of heart object.
var heart = new Heart();

//initialition of gem object.
var gem = new Gem();

//initialition of star object.
var star = new Star();

// Placing all enemy objects in an array called allEnemies
// Placing the player object in a variable called player
var player = new Player();

var en1 = new Enemy(60);
var en2 = new Enemy(143);
var en3 = new Enemy(226);

var allEnemies = [en1, en2, en3];

for (var i = 0; i < allEnemies.length; i++) {
    allEnemies[i].update(100, player);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* function which checks the collision between our player and bugs.
 * obj1 and obj2 refer to the player and enemy bugs respectively.
 */
function checkCollisions(obj1, obj2) {

    if ((obj1.x < obj2.x + 50) &&
        (obj1.x + 50 > obj2.x) &&
        (obj1.y < obj2.y + 50) &&
        (50 + obj1.y > obj2.y)) {

        obj1.x = 202;
        obj1.y = 415;
        if (obj1.lives >= 1) {
            obj1.lives = obj1.lives - 1;
            livesDiv.innerHTML = obj1.lives;
            scoreCard(-1);
        }

        if (obj1.lives === 0) {
            obj1.lives = 0;
            obj1.score = 0;
            livesDiv.innerHTML = obj1.lives;
            scoreDiv.innerHTML = obj1.score;
        }
        return true;
    } else {
        return false;
    }
}

//Function responsible for collision between player and different game elements.
function checkCollection(player) {
    //condition for collection of star object by player.
    if (player.lives != 0) {
        if (player.x < star.x + 50 &&
            player.x + 50 > star.x &&
            player.y < star.y + 50 &&
            player.y + 50 > star.y) {
            scoreCard(2);
        }

        //condition for collection of heart object by player.
        if ((player.x < heart.x + 50) &&
            (player.x + 50 > heart.x) &&
            (player.y < heart.y + 50) &&
            (50 + player.y > heart.y)) {
            scoreCard(5);
        }

        //condition for collection of gem object by player.
        if ((player.x < gem.x + 50) &&
            (player.x + 50 > gem.x) &&
            (player.y < gem.y + 50) &&
            (50 + player.y > gem.y)) {
            scoreCard(1);
        }
    }
}